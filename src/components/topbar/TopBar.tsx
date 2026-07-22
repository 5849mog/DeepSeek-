import { MODES } from '../../config/modes'
import { useChatStore } from '../../store/useChatStore'
import { useUiStore } from '../../store/useUiStore'
import { ExpertMiniIcon } from '../icons/ExpertMiniIcon'
import { FastIcon } from '../icons/FastIcon'
import { VisionMiniIcon } from '../icons/VisionMiniIcon'

/** 顶栏中央的模式小标签图标 */
function ModeMiniIcon({ mode }: { mode: keyof typeof MODES }) {
  if (mode === 'expert') return <ExpertMiniIcon />
  if (mode === 'vision') return <VisionMiniIcon />
  return <FastIcon />
}

/** 顶部栏：侧栏开关、会话标题、模式指示、新对话 */
export function TopBar() {
  const mode = useChatStore((s) => s.mode)
  const currentConversation = useChatStore((s) => s.conversations.find((c) => c.id === s.currentId) || null)
  const newChat = useChatStore((s) => s.newChat)
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)

  const cfg = MODES[mode]
  return (
    <header className="topbar">
      <button id="toggleSidebar" className="icon-btn menu-btn" aria-label="收起或展开侧边栏" onClick={toggleSidebar}>
        <span className="lines"></span>
      </button>
      <div className="title-wrap">
        <h1 id="chatTitle">{currentConversation?.title || '新对话'}</h1>
        <div id="modeMini" className="mode-mini">
          <ModeMiniIcon mode={mode} />
          <span>{cfg.label}</span>
        </div>
      </div>
      <button id="newChatBtn" className="icon-btn new-btn" aria-label="新对话" onClick={newChat}>
        +
      </button>
    </header>
  )
}
