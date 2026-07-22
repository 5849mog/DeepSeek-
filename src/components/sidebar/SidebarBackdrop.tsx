import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useUiStore } from '../../store/useUiStore'

/** 移动端侧栏展开时的遮罩层 */
export function SidebarBackdrop() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useUiStore((s) => s.setSidebarCollapsed)
  const isMobile = useMediaQuery('(max-width: 860px)')
  const show = isMobile && !collapsed
  return (
    <div
      id="sidebarBackdrop"
      className={`sidebar-backdrop${show ? ' show' : ''}`}
      onClick={() => setSidebarCollapsed(true)}
    />
  )
}
