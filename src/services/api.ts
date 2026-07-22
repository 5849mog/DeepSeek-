import { DEFAULT_SETTINGS } from '../config/defaults'
import type { ApiMessage } from '../types/chat'
import type { Settings } from '../types/settings'
import { consumeChatStream, type StreamDelta } from './sse'

/** 去掉 Base URL 末尾多余的斜杠 */
export function normalizedBaseUrl(baseUrl: string): string {
  return (baseUrl || DEFAULT_SETTINGS.baseUrl).trim().replace(/\/+$/, '')
}

export interface ChatRequestOptions {
  settings: Settings
  model: string
  thinking: boolean
  messages: ApiMessage[]
  signal: AbortSignal
  onDelta: (delta: StreamDelta) => void
}

/** 从错误响应体中提取可读的错误信息 */
async function extractErrorDetail(response: Response): Promise<string> {
  let detail = `${response.status} ${response.statusText}`
  try {
    const err = await response.json()
    detail = err?.error?.message || err?.message || detail
  } catch {
    /* 忽略非 JSON 错误体 */
  }
  return detail
}

/** 发起流式聊天补全请求 */
export async function requestChatCompletion(options: ChatRequestOptions): Promise<void> {
  const { settings, model, thinking, messages, signal, onDelta } = options

  const body: Record<string, unknown> = { model, messages, stream: true }
  if (thinking) {
    body.thinking = { type: 'enabled' }
    body.reasoning_effort = settings.effort || 'high'
  } else {
    body.thinking = { type: 'disabled' }
    body.temperature = 0.7
    body.top_p = 0.95
  }

  const response = await fetch(`${normalizedBaseUrl(settings.baseUrl)}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify(body),
    signal,
  })
  if (!response.ok) throw new Error(await extractErrorDetail(response))
  if (!response.body) throw new Error('当前浏览器不支持流式读取响应')

  const reader = response.body.getReader()
  try {
    await consumeChatStream(reader, onDelta)
  } finally {
    await reader.cancel().catch(() => {})
  }
}

/** 设置弹窗中的「测试连接」 */
export async function testConnection(apiKey: string, baseUrl: string, model: string): Promise<void> {
  const base = normalizedBaseUrl(baseUrl)
  const response = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: 'ping' }],
      max_tokens: 1,
      stream: false,
      thinking: { type: 'disabled' },
    }),
  })
  if (!response.ok) throw new Error(await extractErrorDetail(response))
}
