import type { MouseEvent } from 'react'
import type { Conversation } from '../../types/chat'

interface Props {
  conversation: Conversation
  active: boolean
  onSelect: () => void
  onDelete: () => void
}

/** 单条历史会话项（悬停显示删除按钮） */
export function ConversationItem({ conversation, active, onSelect, onDelete }: Props) {
  const title = conversation.title || '新对话'

  const handleDelete = (e: MouseEvent) => {
    e.stopPropagation()
    onDelete()
  }

  return (
    <div className={`conv-item${active ? ' active' : ''}`} onClick={onSelect}>
      <span title={title}>{title}</span>
      <button className="conv-del" title="删除对话" onClick={handleDelete}>
        ✕
      </button>
    </div>
  )
}
