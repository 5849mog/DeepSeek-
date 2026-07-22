import { useState } from 'react'
import { useChatStore } from '../../store/useChatStore'
import { useUiStore } from '../../store/useUiStore'
import type { ChatMessage } from '../../types/chat'
import { CopyActionIcon } from '../icons/CopyActionIcon'
import { DislikeIcon } from '../icons/DislikeIcon'
import { LikeIcon } from '../icons/LikeIcon'
import { RegenIcon } from '../icons/RegenIcon'
import { ShareIcon } from '../icons/ShareIcon'

interface Props {
  message: ChatMessage
}

/** AI 消息操作栏：复制 / 赞 / 踩 / 分享 / 重新生成 */
export function MessageActions({ message }: Props) {
  const regenerate = useChatStore((s) => s.regenerate)
  const conversation = useChatStore((s) => s.conversations.find((c) => c.id === s.currentId) || null)
  const showToast = useUiStore((s) => s.showToast)
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content || '')
      showToast('已复制')
    } catch {
      showToast('复制失败')
    }
  }

  const handleShare = async () => {
    const text = `${conversation?.title || 'DeepSeek 对话'}\n\n${message.content || ''}`
    if (navigator.share) {
      try {
        await navigator.share({ title: conversation?.title || 'DeepSeek', text })
      } catch {
        /* 用户取消分享 */
      }
    } else {
      try {
        await navigator.clipboard.writeText(text)
        showToast('分享内容已复制')
      } catch {
        showToast('当前浏览器不支持分享')
      }
    }
  }

  const handleFeedback = (type: 'like' | 'dislike') => {
    setFeedback(type)
    showToast(type === 'like' ? '已记录赞' : '已记录踩', 1200)
  }

  return (
    <div className="ai-actions">
      <button type="button" title="复制" onClick={handleCopy}>
        <CopyActionIcon />
      </button>
      <button
        type="button"
        title="赞"
        style={feedback === 'like' ? { color: 'var(--blue)' } : undefined}
        onClick={() => handleFeedback('like')}
      >
        <LikeIcon />
      </button>
      <button
        type="button"
        title="踩"
        style={feedback === 'dislike' ? { color: '#d84a4a' } : undefined}
        onClick={() => handleFeedback('dislike')}
      >
        <DislikeIcon />
      </button>
      <button type="button" title="分享" onClick={handleShare}>
        <ShareIcon />
      </button>
      <button type="button" title="重新生成" onClick={() => regenerate(message.id)}>
        <RegenIcon />
      </button>
    </div>
  )
}
