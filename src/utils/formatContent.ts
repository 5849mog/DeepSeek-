import { escapeHtml } from './text'

interface CodeBlock {
  lang: string
  code: string
}

/**
 * 轻量 Markdown → HTML 转换（与原单文件版行为一致）。
 * 输出前所有用户文本均已转义，可安全用于 dangerouslySetInnerHTML。
 * 支持：代码块（带语言标签与复制按钮）、行内代码、加粗、链接、表格、段落。
 */
export function formatContent(src: string): string {
  if (!src) return ''
  const codeBlocks: CodeBlock[] = []
  let text = String(src).replace(/```([a-zA-Z0-9_+-]*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    codeBlocks.push({ lang, code })
    return `\u0000CODE${codeBlocks.length - 1}\u0000`
  })
  text = escapeHtml(text)
  text = text.replace(/`([^`\n]+)`/g, '<code>$1</code>')
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer noopener">$1</a>')

  // 表格解析
  text = text.replace(/((?:^\|.*\|\n)+)/gm, (match) => {
    const rows = match.trim().split('\n').map((r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim()))
    if (rows.length < 2) return match
    let html = '<table>'
    html += '<thead><tr>' + rows[0].map((c) => `<th>${c}</th>`).join('') + '</tr></thead>'
    html += '<tbody>'
    for (let i = 2; i < rows.length; i++) {
      html += '<tr>' + rows[i].map((c) => `<td>${c}</td>`).join('') + '</tr>'
    }
    html += '</tbody></table>'
    return html
  })

  text = text.split(/\n{2,}/).map((part) => `<p>${part.replace(/\n/g, '<br>')}</p>`).join('')

  return text.replace(/\u0000CODE(\d+)\u0000/g, (_, index) => {
    const block = codeBlocks[Number(index)] || { code: '', lang: '' }
    const langLabel = block.lang || 'code'
    const codeContent = escapeHtml(block.code.replace(/^\n+|\n+$/g, ''))
    return `<div class="code-block-wrapper"><div class="code-header"><span class="code-lang">${langLabel}</span><button class="copy-code-btn" type="button" data-code="${encodeURIComponent(codeContent)}">复制代码</button></div><pre><code>${codeContent}</code></pre></div>`
  })
}
