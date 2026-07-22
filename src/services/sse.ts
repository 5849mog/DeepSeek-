/** SSE（Server-Sent Events）流式响应解析 */

export interface StreamDelta {
  reasoning?: string
  content?: string
}

/**
 * 逐块读取 ReadableStream 并解析 OpenAI 兼容的 SSE 数据行，
 * 每收到一个 delta 调用一次 onDelta。
 */
export async function consumeChatStream(
  reader: ReadableStreamDefaultReader<Uint8Array>,
  onDelta: (delta: StreamDelta) => void,
): Promise<void> {
  const decoder = new TextDecoder('utf-8')
  let buffer = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const events = buffer.split('\n\n')
    buffer = events.pop() || ''
    for (const event of events) {
      const lines = event.split('\n').filter((line) => line.startsWith('data:'))
      for (const line of lines) {
        const payload = line.slice(5).trim()
        if (!payload) continue
        if (payload === '[DONE]') return
        let json: any
        try {
          json = JSON.parse(payload)
        } catch {
          continue
        }
        const delta = json?.choices?.[0]?.delta || {}
        const out: StreamDelta = {}
        if (typeof delta.reasoning_content === 'string') out.reasoning = delta.reasoning_content
        if (typeof delta.content === 'string') out.content = delta.content
        if (out.reasoning || out.content) onDelta(out)
      }
    }
  }
}
