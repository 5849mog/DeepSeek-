import { useEffect } from 'react'
import { useAutoScroll } from '../../hooks/useAutoScroll'
import { useChatStore } from '../../store/useChatStore'
import { Welcome } from '../welcome/Welcome'
import { MessageList } from './MessageList'

/** 消息滚动区：欢迎页 + 消息列表，负责自动滚动逻辑 */
export function ChatScroll() {
  const currentId = useChatStore((s) => s.currentId)
  const conversation = useChatStore((s) => s.conversations.find((c) => c.id === s.currentId) || null)
  const { scrollRef, scrollToBottom } = useAutoScroll<HTMLElement>()

  const messages = conversation?.messages ?? []
  const last = messages[messages.length - 1]
  // 流式签名：内容/推理长度或完成态变化时触发滚动判断
  const streamSignature = `${messages.length}:${last?.content.length ?? 0}:${last?.reasoning.length ?? 0}:${last?.done}`

  // 切换会话 / 新消息入列：强制滚到底部
  useEffect(() => {
    requestAnimationFrame(() => scrollToBottom(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId, messages.length])

  // 流式输出：仅在用户本就接近底部时跟随滚动
  useEffect(() => {
    scrollToBottom(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamSignature])

  return (
    <section id="chatScroll" className="chat-scroll" ref={scrollRef}>
      <Welcome hidden={messages.length > 0} />
      <MessageList messages={messages} />
    </section>
  )
}
