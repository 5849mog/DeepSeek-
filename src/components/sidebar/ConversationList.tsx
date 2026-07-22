import { useChatStore } from '../../store/useChatStore'
import type { Conversation } from '../../types/chat'
import { dayLabel } from '../../utils/date'
import { ConversationItem } from './ConversationItem'

interface Props {
  query: string
}

function conversationMatches(conv: Conversation, query: string): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  if ((conv.title || '').toLowerCase().includes(q)) return true
  return conv.messages.some((m) => (m.content || '').toLowerCase().includes(q))
}

/** 历史会话列表（按时间分组：今天 / 昨天 / 30 天内 / 更早） */
export function ConversationList({ query }: Props) {
  const conversations = useChatStore((s) => s.conversations)
  const currentId = useChatStore((s) => s.currentId)
  const selectConversation = useChatStore((s) => s.selectConversation)
  const deleteConversation = useChatStore((s) => s.deleteConversation)

  const trimmed = query.trim()
  const list = conversations
    .slice()
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .filter((conv) => conversationMatches(conv, trimmed))

  if (!list.length) {
    return (
      <nav id="historyList" className="history">
        <div className="empty-history">
          {trimmed ? '没有找到匹配的对话。' : '还没有历史对话。发送第一条消息后会自动出现在这里。'}
        </div>
      </nav>
    )
  }

  let lastGroup = ''
  return (
    <nav id="historyList" className="history">
      {list.map((conv) => {
        const group = dayLabel(conv.updatedAt)
        const showGroup = group !== lastGroup
        lastGroup = group
        return (
          <div key={conv.id}>
            {showGroup && <div className="group-label">{group}</div>}
            <ConversationItem
              conversation={conv}
              active={conv.id === currentId}
              onSelect={() => selectConversation(conv.id)}
              onDelete={() => deleteConversation(conv.id)}
            />
          </div>
        )
      })}
    </nav>
  )
}
