import type { MouseEvent, ReactElement } from 'react'
import { MODES, MODE_KEYS } from '../../config/modes'
import { useChatStore } from '../../store/useChatStore'
import type { ModeKey } from '../../types/chat'
import { ExpertSegIcon } from '../icons/ExpertSegIcon'
import { FastIcon } from '../icons/FastIcon'
import { VisionSegIcon } from '../icons/VisionSegIcon'

const SEG_ICONS: Record<ModeKey, () => ReactElement> = {
  fast: FastIcon,
  expert: ExpertSegIcon,
  vision: VisionSegIcon,
}

/** 欢迎页的三段式模式切换控件 */
export function ModeSegmented() {
  const mode = useChatStore((s) => s.mode)
  const setMode = useChatStore((s) => s.setMode)

  const handleClick = (e: MouseEvent, key: ModeKey) => {
    e.stopPropagation()
    setMode(key)
  }

  return (
    <div className="segmented" role="tablist" aria-label="模式切换">
      {MODE_KEYS.map((key) => {
        const Icon = SEG_ICONS[key]
        const active = key === mode
        return (
          <button
            key={key}
            className={`seg${active ? ' active' : ''}`}
            data-mode={key}
            role="tab"
            aria-selected={active}
            onClick={(e) => handleClick(e, key)}
          >
            <Icon />
            {MODES[key].label}
          </button>
        )
      })}
    </div>
  )
}
