/** HTML 转义，防止注入 */
export function escapeHtml(value: unknown): string {
  return String(value).replace(/[&<>"']/g, (ch) => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }
    return map[ch]
  })
}

/** 根据首条用户消息生成会话标题 */
export function makeTitle(text: string): string {
  const clean = String(text || '').replace(/\s+/g, ' ').trim()
  if (!clean) return '新对话'
  if (/^(你好|您好|hi|hello|hey)(?:\s|$|[，。！,.!])/i.test(clean) || clean === '你好') return 'AI问候'
  return clean.length > 18 ? clean.slice(0, 18) : clean
}
