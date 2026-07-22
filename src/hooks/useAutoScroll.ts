import { useCallback, useRef } from 'react'

/** 消息滚动容器：提供「接近底部」判断与滚动到底部能力 */
export function useAutoScroll<T extends HTMLElement>() {
  const scrollRef = useRef<T | null>(null)

  const isNearBottom = useCallback(() => {
    const el = scrollRef.current
    if (!el) return true
    return el.scrollHeight - el.scrollTop - el.clientHeight < 170
  }, [])

  const scrollToBottom = useCallback(
    (force = false) => {
      const el = scrollRef.current
      if (!el) return
      if (!force && !isNearBottom()) return
      el.scrollTop = el.scrollHeight
    },
    [isNearBottom],
  )

  return { scrollRef, isNearBottom, scrollToBottom }
}
