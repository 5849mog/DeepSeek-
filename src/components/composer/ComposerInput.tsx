import { forwardRef, useEffect, type KeyboardEvent } from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
  onFocusChange: (focused: boolean) => void
  onSubmit: () => void
}

/** 自动增高的消息输入框（Enter 发送，Shift+Enter 换行，兼容中文输入法合成态） */
export const ComposerInput = forwardRef<HTMLTextAreaElement, Props>(function ComposerInput(
  { value, onChange, onFocusChange, onSubmit },
  ref,
) {
  // 自动调整高度（24px ~ 168px）
  useEffect(() => {
    const el = typeof ref === 'object' ? ref?.current : null
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(168, Math.max(24, el.scrollHeight))}px`
  }, [value, ref])

  const handleKeydown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      onSubmit()
    }
  }

  return (
    <textarea
      id="input"
      ref={ref}
      rows={1}
      placeholder="发消息"
      enterKeyHint="send"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => onFocusChange(true)}
      onBlur={() => setTimeout(() => onFocusChange(false), 80)}
      onKeyDown={handleKeydown}
    />
  )
})
