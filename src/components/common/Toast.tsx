import { useUiStore } from '../../store/useUiStore'

/** 全局 Toast 提示 */
export function Toast() {
  const toastText = useUiStore((s) => s.toastText)
  return (
    <div id="toast" className={`toast${toastText ? ' show' : ''}`} role="status">
      {toastText}
    </div>
  )
}
