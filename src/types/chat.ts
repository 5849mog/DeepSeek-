/** 对话领域模型类型定义 */

export type Role = 'user' | 'assistant'

export type ModeKey = 'fast' | 'expert' | 'vision'

export type Effort = 'high' | 'max'

/** 单条聊天消息 */
export interface ChatMessage {
  id: string
  role: Role
  content: string
  /** 思考过程文本（reasoning_content 累积） */
  reasoning: string
  /** 本条是否以思考模式发起 */
  thinking: boolean
  /** 是否已生成完毕 */
  done: boolean
  /** 是否被用户手动停止 */
  stopped: boolean
  /** 错误信息（请求失败/中断） */
  error: string
  /** 思考耗时（秒） */
  thinkSeconds: number
  time: number
}

/** 一个会话 */
export interface Conversation {
  id: string
  title: string
  mode: ModeKey
  deepThink: boolean
  smartSearch: boolean
  createdAt: number
  updatedAt: number
  messages: ChatMessage[]
}

/** 发送给 OpenAI 兼容接口的消息结构 */
export interface ApiMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}
