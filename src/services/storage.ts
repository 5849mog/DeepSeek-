import { DEFAULT_SETTINGS, STORE_KEY } from '../config/defaults'
import { isModeKey } from '../config/modes'
import type { ChatMessage, Conversation, ModeKey } from '../types/chat'
import type { Settings } from '../types/settings'
import { uid } from '../utils/id'

/** 从 localStorage 恢复出来的完整应用状态 */
export interface PersistedState {
  settings: Settings
  conversations: Conversation[]
  currentId: string | null
  mode: ModeKey
  deepThink: boolean
  smartSearch: boolean
}

function normalizeMessage(m: Partial<ChatMessage>): ChatMessage {
  const done = true
  return {
    id: m.id || uid(),
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: String(m.content || ''),
    reasoning: String(m.reasoning || ''),
    thinking: !!m.thinking,
    done,
    stopped: m.done === false ? true : !!m.stopped,
    error: m.error ? String(m.error) : m.done === false && !m.content && !m.reasoning ? '上次生成已中断。' : '',
    thinkSeconds: Number.isFinite(m.thinkSeconds) ? (m.thinkSeconds as number) : 0,
    time: m.time || Date.now(),
  }
}

/** 清洗单个会话数据，容错历史脏数据 */
export function normalizeConversation(conv: Partial<Conversation> | null | undefined): Conversation | null {
  if (!conv || typeof conv !== 'object') return null
  return {
    id: conv.id || uid(),
    title: conv.title || '新对话',
    mode: isModeKey(conv.mode) ? conv.mode : 'fast',
    deepThink: !!conv.deepThink,
    smartSearch: conv.smartSearch !== false,
    createdAt: conv.createdAt || Date.now(),
    updatedAt: conv.updatedAt || Date.now(),
    messages: Array.isArray(conv.messages) ? conv.messages.map(normalizeMessage) : [],
  }
}

/** 读取本地持久化状态；无数据或解析失败时返回 null */
export function loadPersistedState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    return {
      settings: { ...DEFAULT_SETTINGS, ...(data.settings || {}) },
      conversations: Array.isArray(data.conversations)
        ? data.conversations.map(normalizeConversation).filter(Boolean) as Conversation[]
        : [],
      currentId: data.currentId || null,
      mode: isModeKey(data.mode) ? data.mode : 'fast',
      deepThink: !!data.deepThink,
      smartSearch: data.smartSearch !== false,
    }
  } catch (err) {
    console.warn('读取本地状态失败', err)
    return null
  }
}

/** 将当前状态写入 localStorage */
export function savePersistedState(state: PersistedState): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state))
  } catch (err) {
    console.warn('保存本地状态失败', err)
  }
}
