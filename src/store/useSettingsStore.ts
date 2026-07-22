import { create } from 'zustand'
import { DEFAULT_SETTINGS } from '../config/defaults'
import { loadPersistedState } from '../services/storage'
import type { Settings } from '../types/settings'

interface SettingsState {
  settings: Settings
  /** 合并更新部分设置 */
  updateSettings: (patch: Partial<Settings>) => void
  /** 整体替换（设置弹窗保存时） */
  replaceSettings: (next: Settings) => void
}

const persisted = loadPersistedState()

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: persisted?.settings ?? { ...DEFAULT_SETTINGS },

  updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
  replaceSettings: (next) => set({ settings: next }),
}))
