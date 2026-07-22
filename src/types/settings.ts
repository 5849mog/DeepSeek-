import type { Effort } from './chat'

/** API 与界面设置（持久化于 localStorage） */
export interface Settings {
  apiKey: string
  baseUrl: string
  systemPrompt: string
  fastModel: string
  expertModel: string
  visionModel: string
  effort: Effort
  darkMode: boolean
}
