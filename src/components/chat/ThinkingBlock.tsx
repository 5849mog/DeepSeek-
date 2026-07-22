import { useState } from 'react'
import type { ChatMessage } from '../../types/chat'

interface Props {
  message: ChatMessage
}

/** 思考过程块：可折叠，生成中显示流光动画 */
export function ThinkingBlock({ message }: Props) {
  const [closed, setClosed] = useState(false)
  const loading = !message.done
  return (
    <div className={`thinking${loading ? ' loading' : ''}${closed ? ' closed' : ''}`}>
      <div className="thinking-head" onClick={() => setClosed((v) => !v)}>
        <span>{message.done ? `已思考（用时 ${message.thinkSeconds || 0} 秒）` : '正在思考'}</span>
        <span className="chev">⌄</span>
      </div>
      <div className="thinking-body">{message.reasoning || ''}</div>
    </div>
  )
}
