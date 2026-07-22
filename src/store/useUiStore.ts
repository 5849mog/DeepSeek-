import { create } from 'zustand'
import { ATTACH_MAX_COUNT } from '../config/defaults'

/** 本地附件（仅本地预览，不上传） */
export interface Attachment {
  name: string
  type: string
  size: number
  url: string
}

export type AttachIntent = 'camera' | 'album' | 'file'

interface UiState {
  /** 设置弹窗是否打开 */
  settingsOpen: boolean
  /** 附件面板是否展开 */
  attachPanelOpen: boolean
  /** emoji 面板是否展开 */
  emojiPanelOpen: boolean
  /** 侧边栏是否收起（写入 body.sidebar-collapsed） */
  sidebarCollapsed: boolean
  /** 已选择的附件 */
  attachments: Attachment[]
  /** 附件来源意图（拍照/相册/文件） */
  attachIntent: AttachIntent
  /** 当前 toast 文本（空串表示无） */
  toastText: string
  /** 输入框聚焦请求计数器，Composer 监听后执行 focus */
  inputFocusTick: number

  openSettings: () => void
  closeSettings: () => void
  showAttachPanel: () => void
  hideAttachPanel: () => void
  toggleAttachPanel: () => void
  showEmojiPanel: () => void
  hideEmojiPanel: () => void
  toggleEmojiPanel: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  setAttachmentsFromFiles: (files: File[]) => number
  clearAttachments: () => void
  showToast: (text: string, ms?: number) => void
  requestInputFocus: () => void
}

let toastTimer: ReturnType<typeof setTimeout> | null = null

export const isMobileViewport = () => window.matchMedia('(max-width: 860px)').matches

export const useUiStore = create<UiState>((set, get) => ({
  settingsOpen: false,
  attachPanelOpen: false,
  emojiPanelOpen: false,
  sidebarCollapsed: false,
  attachments: [],
  attachIntent: 'file',
  toastText: '',
  inputFocusTick: 0,

  openSettings: () => set({ settingsOpen: true }),
  closeSettings: () => set({ settingsOpen: false }),

  showAttachPanel: () => set({ attachPanelOpen: true }),
  hideAttachPanel: () => set({ attachPanelOpen: false }),
  toggleAttachPanel: () => set((s) => ({ attachPanelOpen: !s.attachPanelOpen, emojiPanelOpen: false })),

  showEmojiPanel: () => set({ emojiPanelOpen: true }),
  hideEmojiPanel: () => set({ emojiPanelOpen: false }),
  toggleEmojiPanel: () => set((s) => ({ emojiPanelOpen: !s.emojiPanelOpen, attachPanelOpen: false })),

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  setAttachmentsFromFiles: (files) => {
    // 释放旧附件的 object URL
    for (const item of get().attachments) {
      if (item.url) URL.revokeObjectURL(item.url)
    }
    const attachments = files.slice(0, ATTACH_MAX_COUNT).map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
      url: file.type.startsWith('image/') ? URL.createObjectURL(file) : '',
    }))
    set({ attachments })
    return attachments.length
  },

  clearAttachments: () => {
    for (const item of get().attachments) {
      if (item.url) URL.revokeObjectURL(item.url)
    }
    set({ attachments: [] })
  },

  showToast: (text, ms = 2400) => {
    if (toastTimer) clearTimeout(toastTimer)
    set({ toastText: text })
    toastTimer = setTimeout(() => set({ toastText: '' }), ms)
  },

  requestInputFocus: () => set((s) => ({ inputFocusTick: s.inputFocusTick + 1 })),
}))
