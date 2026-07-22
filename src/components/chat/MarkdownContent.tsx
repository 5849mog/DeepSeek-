import type { MouseEvent } from 'react'
import { formatContent } from '../../utils/formatContent'

interface Props {
  source: string
}

/**
 * AI 回复正文：轻量 Markdown 渲染。
 * formatContent 输出前已完成 HTML 转义，可安全注入。
 * 代码块「复制代码」按钮通过事件委托处理。
 */
export function MarkdownContent({ source }: Props) {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const btn = (event.target as HTMLElement).closest('.copy-code-btn') as HTMLButtonElement | null
    if (!btn) return
    const code = decodeURIComponent(btn.dataset.code || '')
    navigator.clipboard.writeText(code).then(() => {
      btn.textContent = '已复制'
      setTimeout(() => {
        btn.textContent = '复制代码'
      }, 2000)
    })
  }

  return (
    <div className="ai-content" onClick={handleClick} dangerouslySetInnerHTML={{ __html: formatContent(source) }} />
  )
}
