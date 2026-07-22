import type { RefObject } from 'react'
import { EMOJIS } from '../../config/defaults'
import { useUiStore } from '../../store/useUiStore'

interface Props {
  inputRef: RefObject<HTMLTextAreaElement | null>
  onInsert: (updater: (prev: string) => string) => void
}

/** emoji 面板：在光标处插入表情 */
export function EmojiPanel({ inputRef, onInsert }: Props) {
  const open = useUiStore((s) => s.emojiPanelOpen)

  const insertEmoji = (emoji: string) => {
    const el = inputRef.current
    if (!el) return
    const start = el.selectionStart ?? el.value.length
    const end = el.selectionEnd ?? el.value.length
    onInsert((prev) => {
      const next = prev.slice(0, start) + emoji + prev.slice(end)
      const pos = start + emoji.length
      requestAnimationFrame(() => {
        el.setSelectionRange(pos, pos)
        el.focus()
      })
      return next
    })
  }

  if (!open) return null
  return (
    <div id="emojiPanel" className="emoji-panel" aria-label="表情">
      {EMOJIS.map((emoji) => (
        <button key={emoji} type="button" onClick={() => insertEmoji(emoji)}>
          {emoji}
        </button>
      ))}
    </div>
  )
}
