import { MODES } from '../config/modes'
import type { Conversation } from '../types/chat'

/** 把会话导出为 Markdown 文本 */
export function conversationToMarkdown(conv: Conversation): string {
  let md = `# ${conv.title}\n\n`
  md += `> 模式: ${MODES[conv.mode]?.label || conv.mode} | 深度思考: ${conv.deepThink ? '是' : '否'} | 智能搜索: ${conv.smartSearch ? '是' : '否'}\n\n---\n\n`
  for (const msg of conv.messages) {
    if (msg.role === 'user') {
      md += `**🧑 用户：**\n\n${msg.content}\n\n`
    } else {
      if (msg.reasoning) {
        md += `**🤖 AI (思考过程)：**\n\n${msg.reasoning}\n\n`
      }
      md += `**🤖 AI：**\n\n${msg.content || msg.error}\n\n---\n\n`
    }
  }
  return md
}

/** 触发浏览器下载 */
export function downloadMarkdown(filename: string, markdown: string): void {
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
