import { savePersistedState } from '../services/storage'
import { useChatStore } from './useChatStore'
import { useSettingsStore } from './useSettingsStore'

/**
 * 订阅 chat / settings 两个 store，
 * 任一状态变化即把整体状态写回 localStorage（与原单文件版 saveState 行为一致）。
 * 在 main.tsx 中调用一次。
 */
export function initPersistence(): void {
  const persist = () => {
    const chat = useChatStore.getState()
    savePersistedState({
      settings: useSettingsStore.getState().settings,
      conversations: chat.conversations,
      currentId: chat.currentId,
      mode: chat.mode,
      deepThink: chat.deepThink,
      smartSearch: chat.smartSearch,
    })
  }
  useChatStore.subscribe(persist)
  useSettingsStore.subscribe(persist)
}
