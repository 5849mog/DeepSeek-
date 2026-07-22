import { useUiStore } from '../../store/useUiStore'

/** 侧边栏底部：头像、昵称、设置入口 */
export function ProfileBar() {
  const openSettings = useUiStore((s) => s.openSettings)
  return (
    <div className="profile">
      <div className="avatar">无</div>
      <span>无缺小鱼</span>
      <button id="settingsBtn" className="dots" aria-label="API 设置" title="API 设置" onClick={openSettings}>
        ···
      </button>
    </div>
  )
}
