import { useEffect, useState, type MouseEvent } from 'react'
import { DEFAULT_SETTINGS } from '../../config/defaults'
import { testConnection } from '../../services/api'
import { conversationToMarkdown, downloadMarkdown } from '../../services/export'
import { useChatStore } from '../../store/useChatStore'
import { useSettingsStore } from '../../store/useSettingsStore'
import { useUiStore } from '../../store/useUiStore'
import type { Settings } from '../../types/settings'
import { SettingsField } from './SettingsField'

/** API 设置弹窗：Key / Base URL / 系统提示词 / 模型 / 思考强度 / 暗黑模式 */
export function SettingsModal() {
  const open = useUiStore((s) => s.settingsOpen)
  const closeSettings = useUiStore((s) => s.closeSettings)
  const showToast = useUiStore((s) => s.showToast)

  const settings = useSettingsStore((s) => s.settings)
  const replaceSettings = useSettingsStore((s) => s.replaceSettings)
  const updateSettings = useSettingsStore((s) => s.updateSettings)

  const conversation = useChatStore((s) => s.conversations.find((c) => c.id === s.currentId) || null)

  const [draft, setDraft] = useState<Settings>(settings)
  const [testing, setTesting] = useState(false)

  // 打开时用当前设置初始化草稿
  useEffect(() => {
    if (open) setDraft(useSettingsStore.getState().settings)
  }, [open])

  // 打开后聚焦首个待填字段
  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => {
      const id = useSettingsStore.getState().settings.apiKey ? 'baseUrl' : 'apiKey'
      ;(document.getElementById(id) as HTMLInputElement | null)?.focus()
    }, 60)
    return () => clearTimeout(timer)
  }, [open])

  const patchDraft = (patch: Partial<Settings>) => setDraft((d) => ({ ...d, ...patch }))

  const handleSave = () => {
    replaceSettings({
      apiKey: draft.apiKey.trim(),
      baseUrl: draft.baseUrl.trim() || DEFAULT_SETTINGS.baseUrl,
      systemPrompt: draft.systemPrompt.trim() || DEFAULT_SETTINGS.systemPrompt,
      fastModel: draft.fastModel.trim() || 'deepseek-v4-flash',
      expertModel: draft.expertModel.trim() || 'deepseek-v4-pro',
      visionModel: draft.visionModel.trim() || 'deepseek-v4-flash',
      effort: draft.effort === 'max' ? 'max' : 'high',
      darkMode: draft.darkMode,
    })
    closeSettings()
    showToast('设置已保存')
  }

  const handleClearKey = () => {
    patchDraft({ apiKey: '' })
    updateSettings({ apiKey: '' })
    showToast('API Key 已清除')
  }

  const handleTest = async () => {
    const key = draft.apiKey.trim()
    if (!key) {
      showToast('请先填入 API Key')
      return
    }
    setTesting(true)
    try {
      await testConnection(key, draft.baseUrl.trim() || DEFAULT_SETTINGS.baseUrl, draft.fastModel.trim() || 'deepseek-v4-flash')
      showToast('连接成功：DeepSeek V4 API 可用')
    } catch (err: any) {
      showToast(`连接失败：${err?.message || err}`, 4200)
    } finally {
      setTesting(false)
    }
  }

  const handleExport = () => {
    if (!conversation || !conversation.messages.length) {
      showToast('当前没有可导出的对话')
      return
    }
    downloadMarkdown(`${conversation.title || 'deepseek_chat'}.md`, conversationToMarkdown(conversation))
    showToast('已导出 Markdown 文件')
  }

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) closeSettings()
  }

  return (
    <div
      id="settingsOverlay"
      className={`overlay${open ? ' show' : ''}`}
      aria-hidden={!open}
      onClick={handleOverlayClick}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="settingsTitle">
        <h3 id="settingsTitle">DeepSeek API 设置</h3>
        <p className="sub">
          接入官方 OpenAI 兼容接口，默认模型为 deepseek-v4-flash / deepseek-v4-pro。API Key
          仅保存在当前浏览器 localStorage，不会上传到任何第三方服务器；公共设备请及时清除。
        </p>
        <SettingsField label="DeepSeek API Key" htmlFor="apiKey">
          <input
            id="apiKey"
            type="password"
            placeholder="sk-..."
            autoComplete="off"
            value={draft.apiKey}
            onChange={(e) => patchDraft({ apiKey: e.target.value })}
          />
        </SettingsField>
        <SettingsField label="Base URL（可填反向代理以解决浏览器 CORS）" htmlFor="baseUrl">
          <input
            id="baseUrl"
            type="url"
            placeholder="https://api.deepseek.com"
            autoComplete="off"
            value={draft.baseUrl}
            onChange={(e) => patchDraft({ baseUrl: e.target.value })}
          />
        </SettingsField>
        <SettingsField label="系统提示词" htmlFor="systemPrompt">
          <textarea
            id="systemPrompt"
            placeholder="你是 DeepSeek，一个严谨、友好、乐于助人的 AI 助手..."
            value={draft.systemPrompt}
            onChange={(e) => patchDraft({ systemPrompt: e.target.value })}
          />
        </SettingsField>
        <div className="grid-2">
          <SettingsField label="快速模式模型" htmlFor="fastModel">
            <input
              id="fastModel"
              type="text"
              placeholder="deepseek-v4-flash"
              value={draft.fastModel}
              onChange={(e) => patchDraft({ fastModel: e.target.value })}
            />
          </SettingsField>
          <SettingsField label="专家模式模型" htmlFor="expertModel">
            <input
              id="expertModel"
              type="text"
              placeholder="deepseek-v4-pro"
              value={draft.expertModel}
              onChange={(e) => patchDraft({ expertModel: e.target.value })}
            />
          </SettingsField>
        </div>
        <div className="grid-2">
          <SettingsField label="识图模式模型" htmlFor="visionModel">
            <input
              id="visionModel"
              type="text"
              placeholder="deepseek-v4-flash"
              value={draft.visionModel}
              onChange={(e) => patchDraft({ visionModel: e.target.value })}
            />
          </SettingsField>
          <SettingsField label="思考强度" htmlFor="effort">
            <select
              id="effort"
              value={draft.effort}
              onChange={(e) => patchDraft({ effort: e.target.value === 'max' ? 'max' : 'high' })}
            >
              <option value="high">high</option>
              <option value="max">max</option>
            </select>
          </SettingsField>
        </div>
        <div className="field" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 20 }}>
          <input
            type="checkbox"
            id="darkModeToggle"
            style={{ width: 18, height: 18 }}
            checked={draft.darkMode}
            onChange={(e) => {
              patchDraft({ darkMode: e.target.checked })
              updateSettings({ darkMode: e.target.checked })
            }}
          />
          <label htmlFor="darkModeToggle" style={{ margin: 0, cursor: 'pointer' }}>
            启用暗黑模式
          </label>
        </div>
        <div className="note">
          官方 V4 API 模型 ID 为 <b>deepseek-v4-flash</b> 与 <b>deepseek-v4-pro</b>，支持 1M
          上下文、思考/非思考双模式；思考模式通过 <code>thinking</code> 与 <code>reasoning_effort</code>
          控制。若浏览器直连被 CORS 拦截，请把 Base URL 改成你自己的 OpenAI 兼容代理。
        </div>
        <div className="modal-actions">
          <button id="testApiBtn" className="btn" type="button" disabled={testing} onClick={handleTest}>
            {testing ? '测试中...' : '测试连接'}
          </button>
          <button id="exportChatBtn" className="btn" type="button" onClick={handleExport}>
            导出当前对话
          </button>
          <button id="clearKeyBtn" className="btn danger" type="button" onClick={handleClearKey}>
            清除 Key
          </button>
          <div className="spacer"></div>
          <button id="closeSettingsBtn" className="btn" type="button" onClick={closeSettings}>
            取消
          </button>
          <button id="saveSettingsBtn" className="btn primary" type="button" onClick={handleSave}>
            保存
          </button>
        </div>
      </div>
    </div>
  )
}
