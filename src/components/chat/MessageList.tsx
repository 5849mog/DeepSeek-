import type { ChatMessage } from '../../types/chat'
import { AiMessage } from './AiMessage'
import { UserMessage } from './UserMessage'

interface Props {
  messages: ChatMessage[]
}

/** 消息列表 */
export function MessageList({ messages }: Props) {
  return (
    <div id="messages" className="messages" aria-live="polite">
      {messages.map((msg) =>
        msg.role === 'user' ? <UserMessage key={msg.id} message={msg} /> : <AiMessage key={msg.id} message={msg} />,
      )}
    </div>
  )
}
