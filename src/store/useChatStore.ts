import { create } from 'zustand'
import { DEFAULT_SETTINGS } from '../config/defaults'
import { isModeKey, MODES } from '../config/modes'
import { requestChatCompletion } from '../services/api'
import { loadPersistedState } from '../services/storage'
import type { ApiMessage, ChatMessage, Conversation, ModeKey } from '../types/chat'
import { uid } from '../utils/id'
import { makeTitle } from '../utils/text'
import { isMobileViewport, useUiStore } from './useUiStore'
import { useSettingsStore } from './useSettingsStore'

interface ChatState {
  conversations: Conversation[]
  currentId: string | null
  mode: ModeKey
  deepThink: boolean
  smartSearch: boolean
  sending: boolean

  currentConversation: () => Conversation | null
  setMode: (next: ModeKey, options?: { keepAttach?: boolean }) => void
  toggleDeepThink: () => void
  toggleSmartSearch: () => void
  selectConversation: (id: string) => void
  newChat: () => void
  deleteConversation: (id: string) => void
  sendMessage: (text: string) => Promise<void>
  regenerate: (messageId: string) => Promise<void>
  stopGeneration: () => void
}

const persisted = loadPersistedState()

/** 当前进行中的请求的中断控制器（非响应式，模块级持有） */
let abortController: AbortController | null = null

const toast = (text: string, ms?: number) => useUiStore.getState().showToast(text, ms)

function createEmptyConversation(title: string, mode: ModeKey, deepThink: boolean, smartSearch: boolean): Conversation {
  return {
    id: uid(),
    title,
    mode,
    deepThink,
    smartSearch,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: [],
  }
}

function buildApiMessages(conv: Conversation, systemPrompt: string): ApiMessage[] {
  const system: ApiMessage = { role: 'system', content: systemPrompt || DEFAULT_SETTINGS.systemPrompt }
  const msgs = conv.messages
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && m.content)
    .map((m) => ({ role: m.role, content: m.content }) as ApiMessage)
  return [system, ...msgs]
}

export const useChatStore = create<ChatState>((set, get) => {
  /** 更新当前会话（map 替换，返回新数组） */
  function patchConversation(id: string, patch: (conv: Conversation) => Conversation) {
    set((s) => ({
      conversations: s.conversations.map((c) => (c.id === id ? patch(c) : c)),
    }))
  }

  /** 更新会话中的单条消息 */
  function patchMessage(convId: string, messageId: string, patch: (msg: ChatMessage) => ChatMessage) {
    patchConversation(convId, (conv) => ({
      ...conv,
      messages: conv.messages.map((m) => (m.id === messageId ? patch(m) : m)),
    }))
  }

  /** 核心：向 API 请求 assistant 回复（流式） */
  async function requestAssistant(convId: string) {
    const { sending } = get()
    if (sending) return

    const settings = useSettingsStore.getState().settings
    if (!settings.apiKey) {
      useUiStore.getState().openSettings()
      toast('请先填入 DeepSeek API Key')
      return
    }

    const conv = get().conversations.find((c) => c.id === convId)
    if (!conv) return

    const { mode, deepThink } = get()
    const cfg = MODES[mode]
    const thinking = cfg.resolveThinking(deepThink)

    const aiMsg: ChatMessage = {
      id: uid(),
      role: 'assistant',
      content: '',
      reasoning: '',
      thinking,
      done: false,
      stopped: false,
      error: '',
      thinkSeconds: 0,
      time: Date.now(),
    }

    patchConversation(convId, (c) => ({ ...c, messages: [...c.messages, aiMsg], updatedAt: Date.now() }))
    set({ sending: true })
    abortController = new AbortController()
    const start = Date.now()

    try {
      await requestChatCompletion({
        settings,
        model: cfg.resolveModel(settings),
        thinking,
        messages: buildApiMessages(get().conversations.find((c) => c.id === convId) || conv, settings.systemPrompt),
        signal: abortController.signal,
        onDelta: (delta) => {
          patchMessage(convId, aiMsg.id, (m) => ({
            ...m,
            reasoning: delta.reasoning ? m.reasoning + delta.reasoning : m.reasoning,
            content: delta.content ? m.content + delta.content : m.content,
          }))
        },
      })
      patchMessage(convId, aiMsg.id, (m) => ({
        ...m,
        done: true,
        thinkSeconds: Math.max(0, Math.round((Date.now() - start) / 1000)),
      }))
    } catch (err: any) {
      const isAbort = err?.name === 'AbortError'
      let errorText = ''
      if (isAbort) {
        const m = (get().conversations.find((c) => c.id === convId)?.messages || []).find((x) => x.id === aiMsg.id)
        if (m && !m.content && !m.reasoning) errorText = '已停止生成。'
      } else {
        errorText = `请求失败：${err?.message || err}`
        if (/401|unauthorized|invalid api key/i.test(errorText)) {
          toast('API Key 无效，请检查设置', 3200)
        } else if (/Failed to fetch|NetworkError|CORS/i.test(errorText)) {
          toast('浏览器直连失败，可能是 CORS；请在设置中填代理 Base URL', 4200)
        } else {
          toast(errorText, 3200)
        }
      }
      patchMessage(convId, aiMsg.id, (m) => ({
        ...m,
        done: true,
        stopped: isAbort ? true : m.stopped,
        error: errorText,
        thinkSeconds: Math.max(0, Math.round((Date.now() - start) / 1000)),
      }))
    } finally {
      set({ sending: false })
      abortController = null
      patchConversation(convId, (c) => ({ ...c, updatedAt: Date.now() }))
    }
  }

  return {
    conversations: persisted?.conversations ?? [],
    currentId: persisted?.currentId ?? null,
    mode: persisted?.mode ?? 'fast',
    deepThink: persisted?.deepThink ?? false,
    smartSearch: persisted?.smartSearch ?? true,
    sending: false,

    currentConversation: () => {
      const { conversations, currentId } = get()
      return conversations.find((c) => c.id === currentId) || null
    },

    setMode: (next, options = {}) => {
      if (!isModeKey(next)) return
      const ui = useUiStore.getState()
      set({ mode: next })
      if (next === 'vision') ui.showAttachPanel()
      else if (!options.keepAttach) ui.hideAttachPanel()
      if (next === 'expert' && get().smartSearch) {
        set({ smartSearch: false })
        toast('专家模式已关闭智能搜索', 1600)
      }
      const conv = get().currentConversation()
      if (conv) {
        patchConversation(conv.id, (c) => ({ ...c, mode: next, updatedAt: Date.now() }))
      }
    },

    toggleDeepThink: () => {
      const { mode, deepThink } = get()
      if (mode === 'expert') {
        toast('专家模式默认开启深度思考', 1600)
        return
      }
      const next = !deepThink
      set({ deepThink: next })
      const conv = get().currentConversation()
      if (conv) patchConversation(conv.id, (c) => ({ ...c, deepThink: next }))
    },

    toggleSmartSearch: () => {
      const { mode, smartSearch } = get()
      if (mode === 'expert') {
        toast('专家模式当前不支持搜索', 1800)
        return
      }
      const next = !smartSearch
      set({ smartSearch: next })
      const conv = get().currentConversation()
      if (conv) patchConversation(conv.id, (c) => ({ ...c, smartSearch: next }))
    },

    selectConversation: (id) => {
      if (get().sending) get().stopGeneration()
      set({ currentId: id })
      const conv = get().currentConversation()
      if (conv) {
        set({
          mode: isModeKey(conv.mode) ? conv.mode : 'fast',
          deepThink: !!conv.deepThink,
          smartSearch: conv.smartSearch !== false,
        })
      }
      if (isMobileViewport()) useUiStore.getState().setSidebarCollapsed(true)
      useUiStore.getState().requestInputFocus()
    },

    newChat: () => {
      if (get().sending) get().stopGeneration()
      set({ currentId: null })
      useUiStore.getState().requestInputFocus()
    },

    deleteConversation: (id) => {
      set((s) => ({
        conversations: s.conversations.filter((c) => c.id !== id),
        currentId: s.currentId === id ? null : s.currentId,
      }))
      toast('对话已删除')
    },

    sendMessage: async (text) => {
      const trimmed = text.trim()
      const { sending, mode, deepThink, smartSearch } = get()
      if (!trimmed || sending) return

      const ui = useUiStore.getState()
      if (mode === 'vision' && ui.attachments.length) {
        toast('识图 UI 已复刻；官方 V4 API 当前按文本接口发送，附件仅本地预览', 3600)
      }

      // 确保存在当前会话
      let conv = get().currentConversation()
      if (!conv) {
        conv = createEmptyConversation(makeTitle(trimmed), mode, deepThink, smartSearch)
        set((s) => ({ conversations: [conv as Conversation, ...s.conversations], currentId: (conv as Conversation).id }))
      }

      const userMsg: ChatMessage = {
        id: uid(),
        role: 'user',
        content: trimmed,
        reasoning: '',
        thinking: false,
        done: true,
        stopped: false,
        error: '',
        thinkSeconds: 0,
        time: Date.now(),
      }
      patchConversation(conv.id, (c) => ({
        ...c,
        title: c.messages.length === 0 ? makeTitle(trimmed) : c.title,
        mode,
        deepThink,
        smartSearch,
        messages: [...c.messages, userMsg],
        updatedAt: Date.now(),
      }))
      ui.clearAttachments()
      await requestAssistant(conv.id)
    },

    regenerate: async (messageId) => {
      const { sending } = get()
      if (sending) return
      const conv = get().currentConversation()
      if (!conv) return
      const index = conv.messages.findIndex((m) => m.id === messageId)
      if (index < 0) return
      const lastUser = [...conv.messages.slice(0, index)].reverse().find((m) => m.role === 'user')
      if (!lastUser) return
      patchConversation(conv.id, (c) => ({ ...c, messages: c.messages.slice(0, index), updatedAt: Date.now() }))
      await requestAssistant(conv.id)
    },

    stopGeneration: () => {
      if (abortController) abortController.abort()
    },
  }
})
