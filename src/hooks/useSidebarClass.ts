import { useEffect } from 'react'
import { useUiStore } from '../store/useUiStore'

/** 根据 UI 状态同步 body.sidebar-collapsed 类名（CSS 依赖该类控制侧栏滑出） */
export function useSidebarClass(): void {
  const collapsed = useUiStore((s) => s.sidebarCollapsed)
  useEffect(() => {
    document.body.classList.toggle('sidebar-collapsed', collapsed)
  }, [collapsed])
}
