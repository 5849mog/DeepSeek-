import type { ChatMessage } from '../../types/chat'
import { escapeHtml } from '../../utils/text'
import { MarkdownContent } from './MarkdownContent'
import { MessageActions } from './MessageActions'
import { ThinkingBlock } from './ThinkingBlock'

interface Props {
  message: ChatMessage
}

/** AI 消息：思考块 + 正文 + 操作栏 */
export function AiMessage({ message }: Props) {
  return (
    <div className="msg ai" data-mid={message.id}>
      {(message.thinking || message.reasoning) && <ThinkingBlock message={message} />}
      {message.error ? (
        <div
          className="ai-content"
          dangerouslySetInnerHTML={{ __html: `<p style="color:#d84a4a">${escapeHtml(message.error)}</p>` }}
        />
      ) : message.done ? (
        <MarkdownContent source={message.content} />
      ) : (
        <div className="ai-content">
          {message.content || ''}
          <span className="cursor"></span>
        </div>
      )}
      {message.done && <MessageActions message={message} />}
    </div>
  )
}
