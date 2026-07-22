import { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../../store/useChatStore'
import { useUiStore } from '../../store/useUiStore'
import { AttachPanel } from './AttachPanel'
import { ComposerActions } from './ComposerActions'
import { ComposerInput } from './ComposerInput'
import { ComposerTools } from './ComposerTools'
import { EmojiPanel } from './EmojiPanel'

/**
 * 输入区底座：附件面板 + emoji 面板 + 输入表单。
 * 输入文本 / 聚焦状态在此集中管理，供工具行与按钮行共享。
 */
export function ComposerDock() {
  const [text, setText] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  const sending = useChatStore((s) => s.sending)
  const sendMessage = useChatStore((s) => s.sendMessage)
  const inputFocusTick = useUiStore((s) => s.inputFocusTick)

  // 外部聚焦请求（切换会话 / 新对话 / Cmd+K 之外的入口）
  useEffect(() => {
    if (inputFocusTick > 0) inputRef.current?.focus({ preventScroll: true })
  }, [inputFocusTick])

  const hasText = text.trim().length > 0
  const showVoice = !hasText && !focused && !sending

  const handleSend = () => {
    const value = text.trim()
    if (!value || sending) return
    setText('')
    void sendMessage(value)
  }

  return (
    <div className="composer-dock">
      <AttachPanel />
      <EmojiPanel inputRef={inputRef} onInsert={setText} />
      <form
        id="composer"
        className={`composer${focused ? ' focus' : ''}${showVoice ? ' voice-empty' : ''}`}
        autoComplete="off"
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
      >
        <div className="input-row">
          <ComposerInput
            ref={inputRef}
            value={text}
            onChange={setText}
            onFocusChange={setFocused}
            onSubmit={handleSend}
          />
          <div id="voicePlaceholder" className={`voice-placeholder${showVoice ? '' : ' hide'}`}>
            按住说话
          </div>
        </div>
        <div className="tool-row">
          <ComposerTools />
          <ComposerActions hasText={hasText} onSend={handleSend} />
        </div>
      </form>
    </div>
  )
}
