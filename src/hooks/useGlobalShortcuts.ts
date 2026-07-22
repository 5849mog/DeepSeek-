import { useEffect } from 'react'
import { useUiStore } from '../store/useUiStore'

/**
 * 全局快捷键：
 * - Escape：关闭设置弹窗 / 附件面板 / emoji 面板
 * - Cmd/Ctrl + K：聚焦侧边栏搜索框
 */
export function useGlobalShortcuts(): void {
  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      const ui = useUiStore.getState()
      if (event.key === 'Escape') {
        ui.closeSettings()
        ui.hideAttachPanel()
        ui.hideEmojiPanel()
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        ;(document.getElementById('searchInput') as HTMLInputElement | null)?.focus()
      }
    }
    document.addEventListener('keydown', onKeydown)
    return () => document.removeEventListener('keydown', onKeydown)
  }, [])
}
