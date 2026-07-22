import { MODES } from '../../config/modes'
import { useChatStore } from '../../store/useChatStore'
import { LogoIcon } from '../icons/LogoIcon'
import { ModeSegmented } from './ModeSegmented'

interface Props {
  /** 当前会话已有消息时隐藏欢迎页 */
  hidden: boolean
}

/** 空会话时的欢迎页：品牌 + 模式切换 */
export function Welcome({ hidden }: Props) {
  const mode = useChatStore((s) => s.mode)
  const cfg = MODES[mode]
  return (
    <div id="welcome" className={`welcome${hidden ? ' hidden' : ''}`}>
      <div className="brand">
        <LogoIcon />
        <h2 id="welcomeTitle">{`使用${cfg.label}开始对话`}</h2>
      </div>
      <ModeSegmented />
      <p id="modeDesc" className="mode-desc">
        {cfg.desc}
      </p>
    </div>
  )
}
