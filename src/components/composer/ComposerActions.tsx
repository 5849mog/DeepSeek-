import type { MouseEvent } from 'react'
import { useChatStore } from '../../store/useChatStore'
import { useUiStore } from '../../store/useUiStore'
import { EmojiIcon } from '../icons/EmojiIcon'
import { SendIcon } from '../icons/SendIcon'

interface Props {
  hasText: boolean
  onSend: () => void
}

/** 输入区右侧操作：附件 / 表情 / 发送 / 停止 */
export function ComposerActions({ hasText, onSend }: Props) {
  const sending = useChatStore((s) => s.sending)
  const stopGeneration = useChatStore((s) => s.stopGeneration)
  const toggleAttachPanel = useUiStore((s) => s.toggleAttachPanel)
  const toggleEmojiPanel = useUiStore((s) => s.toggleEmojiPanel)

  const sendVisible = hasText && !sending

  const stopPropagation = (e: MouseEvent) => e.stopPropagation()

  return (
    <div className="right-tools">
      <button
        id="plusBtn"
        className="round-btn"
        type="button"
        aria-label="添加附件"
        onClick={(e) => {
          stopPropagation(e)
          toggleAttachPanel()
        }}
      >
        +
      </button>
      <button
        id="emojiBtn"
        className="round-btn"
        type="button"
        aria-label="表情"
        onClick={(e) => {
          stopPropagation(e)
          toggleEmojiPanel()
        }}
      >
        <EmojiIcon />
      </button>
      <button
        id="sendBtn"
        className={`send-btn${sendVisible ? '' : ' hidden'}`}
        type="submit"
        disabled={!sendVisible}
        aria-label="发送"
        onClick={(e) => {
          e.preventDefault()
          onSend()
        }}
      >
        <SendIcon />
      </button>
      <button
        id="stopBtn"
        className={`stop-btn${sending ? '' : ' hidden'}`}
        type="button"
        aria-label="停止生成"
        onClick={stopGeneration}
      >
        <span></span>
      </button>
    </div>
  )
}
