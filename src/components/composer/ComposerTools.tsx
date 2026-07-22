import { modelHint } from '../../config/modes'
import { useChatStore } from '../../store/useChatStore'
import { useSettingsStore } from '../../store/useSettingsStore'
import { GlobeIcon } from '../icons/GlobeIcon'
import { ThinkIcon } from '../icons/ThinkIcon'

/** 输入区左侧工具：深度思考 / 智能搜索开关 + 模型提示 */
export function ComposerTools() {
  const mode = useChatStore((s) => s.mode)
  const deepThink = useChatStore((s) => s.deepThink)
  const smartSearch = useChatStore((s) => s.smartSearch)
  const toggleDeepThink = useChatStore((s) => s.toggleDeepThink)
  const toggleSmartSearch = useChatStore((s) => s.toggleSmartSearch)
  const settings = useSettingsStore((s) => s.settings)

  const thinkActive = deepThink || mode === 'expert'
  return (
    <div className="left-tools">
      <button
        id="thinkBtn"
        className={`pill${thinkActive ? ' active' : ''}`}
        type="button"
        aria-pressed={thinkActive}
        onClick={toggleDeepThink}
      >
        <ThinkIcon />
        深度思考
      </button>
      <button
        id="searchBtn"
        className={`pill${smartSearch ? ' active' : ''}`}
        type="button"
        aria-pressed={smartSearch}
        onClick={toggleSmartSearch}
      >
        <GlobeIcon />
        智能搜索
      </button>
      <span id="modelHint" className="model-hint">
        {modelHint(mode, settings, deepThink)}
      </span>
    </div>
  )
}
