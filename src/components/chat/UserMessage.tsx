import type { ChatMessage } from '../../types/chat'

interface Props {
  message: ChatMessage
}

/** 用户消息气泡（纯文本，保留换行） */
export function UserMessage({ message }: Props) {
  return (
    <div className="msg user" data-mid={message.id}>
      <div className="user-bubble">{message.content}</div>
    </div>
  )
}
