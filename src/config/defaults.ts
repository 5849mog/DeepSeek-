import type { Settings } from '../types/settings'

/** localStorage 存储键 */
export const STORE_KEY = 'deepseek_replica_v2'

/** 默认系统提示词 */
export const DEFAULT_SYSTEM_PROMPT =
  '你是 DeepSeek，一个严谨、友好、乐于助人的 AI 助手。默认使用中文回答；涉及代码时给出可直接运行的实现；不要编造不存在的来源或功能。'

/** 默认设置 */
export const DEFAULT_SETTINGS: Settings = {
  apiKey: '',
  baseUrl: 'https://api.deepseek.com',
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
  fastModel: 'deepseek-v4-flash',
  expertModel: 'deepseek-v4-pro',
  visionModel: 'deepseek-v4-flash',
  effort: 'high',
  darkMode: false,
}

/** emoji 面板内容 */
export const EMOJIS = [
  '😀', '😁', '😂', '🤣', '😊', '😉', '😍', '😘',
  '😜', '🤔', '👍', '👎', '👏', '🙏', '💪', '🔥',
  '✨', '🎉', '❤️', '💡', '📌', '✅', '❌', '⚡',
  '🌙', '☀️', '🍀', '📷', '📎', '🎵', '🚀', '🧠',
]

/** 附件面板占位缩略图数量 */
export const ATTACH_PLACEHOLDER_COUNT = 8

/** 附件选择上限 */
export const ATTACH_MAX_COUNT = 12
