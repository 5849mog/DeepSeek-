import { useRef, type ReactElement } from 'react'
import { ATTACH_PLACEHOLDER_COUNT } from '../../config/defaults'
import { useUiStore, type AttachIntent } from '../../store/useUiStore'
import { AlbumIcon } from '../icons/AlbumIcon'
import { CameraIcon } from '../icons/CameraIcon'
import { FileIcon } from '../icons/FileIcon'

const ATTACH_ACTIONS: { intent: AttachIntent; label: string; Icon: () => ReactElement }[] = [
  { intent: 'camera', label: '拍照', Icon: CameraIcon },
  { intent: 'album', label: '相册', Icon: AlbumIcon },
  { intent: 'file', label: '文件', Icon: FileIcon },
]

/** 附件面板：缩略图预览 + 拍照/相册/文件入口（仅本地预览，不上传） */
export function AttachPanel() {
  const open = useUiStore((s) => s.attachPanelOpen)
  const attachments = useUiStore((s) => s.attachments)
  const setAttachmentsFromFiles = useUiStore((s) => s.setAttachmentsFromFiles)
  const showToast = useUiStore((s) => s.showToast)
  const filePickerRef = useRef<HTMLInputElement | null>(null)

  const handleAction = (intent: AttachIntent) => {
    const picker = filePickerRef.current
    if (!picker) return
    picker.value = ''
    if (intent === 'file') {
      picker.removeAttribute('accept')
      picker.removeAttribute('capture')
    } else {
      picker.setAttribute('accept', 'image/*')
      if (intent === 'camera') picker.setAttribute('capture', 'environment')
      else picker.removeAttribute('capture')
    }
    picker.click()
  }

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const count = setAttachmentsFromFiles(Array.from(files))
    if (count) showToast(`已选择 ${count} 个附件（本地预览）`)
  }

  return (
    <div id="attachPanel" className={`attach-panel${open ? ' show' : ''}`} aria-hidden={!open}>
      <div className="attach-head">按住说话</div>
      <div className="thumbs" id="thumbRow">
        {attachments.length === 0
          ? Array.from({ length: ATTACH_PLACEHOLDER_COUNT }, (_, i) => <div key={i} className="thumb"></div>)
          : attachments.slice(0, 12).map((item, i) => (
              <div
                key={`${item.name}-${i}`}
                className="thumb"
                title={item.url ? undefined : item.name}
                style={
                  item.url
                    ? { background: `center/cover no-repeat url("${item.url}")`, border: '1px solid var(--blue-soft)' }
                    : undefined
                }
              ></div>
            ))}
      </div>
      <div className="attach-actions">
        {ATTACH_ACTIONS.map(({ intent, label, Icon }) => (
          <button key={intent} className="attach-action" type="button" data-attach={intent} onClick={() => handleAction(intent)}>
            <Icon />
            <span>{label}</span>
          </button>
        ))}
      </div>
      <input
        id="filePicker"
        ref={filePickerRef}
        type="file"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
