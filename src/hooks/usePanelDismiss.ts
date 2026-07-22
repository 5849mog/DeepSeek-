import { useEffect } from 'react'
import { useUiStore } from '../store/useUiStore'

/** 点击面板外部时，自动收起附件面板与 emoji 面板 */
export function usePanelDismiss(): void {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const ui = useUiStore.getState()
      if (!target.closest('.attach-panel') && !target.closest('#plusBtn')) ui.hideAttachPanel()
      if (!target.closest('.emoji-panel') && !target.closest('#emojiBtn')) ui.hideEmojiPanel()
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}
