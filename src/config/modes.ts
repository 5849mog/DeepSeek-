import type { Effort, ModeKey } from '../types/chat'
import type { Settings } from '../types/settings'

/** 单个模式的行为配置 */
export interface ModeConfig {
  label: string
  desc: string
  /** 从设置中解析该模式使用的模型 ID */
  resolveModel: (settings: Settings) => string
  /** 该模式是否启用思考（专家模式恒为 true，其余跟随 deepThink 开关） */
  resolveThinking: (deepThink: boolean) => boolean
}

export const MODES: Record<ModeKey, ModeConfig> = {
  fast: {
    label: '快速模式',
    desc: '适合日常对话，即时响应',
    resolveModel: (s) => s.fastModel || 'deepseek-v4-flash',
    resolveThinking: (deepThink) => deepThink,
  },
  expert: {
    label: '专家模式',
    desc: '擅长复杂问题，资源紧张，不支持搜索和文件上传',
    resolveModel: (s) => s.expertModel || 'deepseek-v4-pro',
    resolveThinking: () => true,
  },
  vision: {
    label: '识图模式',
    desc: '图片理解功能内测中',
    resolveModel: (s) => s.visionModel || 'deepseek-v4-flash',
    resolveThinking: (deepThink) => deepThink,
  },
}

export const MODE_KEYS: ModeKey[] = ['fast', 'expert', 'vision']

export function isModeKey(value: unknown): value is ModeKey {
  return value === 'fast' || value === 'expert' || value === 'vision'
}

/** 顶栏模型提示文案，例如 "deepseek-v4-flash · 思考/high" */
export function modelHint(mode: ModeKey, settings: Settings, deepThink: boolean): string {
  const cfg = MODES[mode]
  const thinking = cfg.resolveThinking(deepThink)
  const effort: Effort = settings.effort || 'high'
  return `${cfg.resolveModel(settings)} · ${thinking ? `思考/${effort}` : '非思考'}`
}
