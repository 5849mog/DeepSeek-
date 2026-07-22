import { useEffect } from 'react'
import { ChatScroll } from './components/chat/ChatScroll'
import { Toast } from './components/common/Toast'
import { ComposerDock } from './components/composer/ComposerDock'
import { SettingsModal } from './components/settings/SettingsModal'
import { Sidebar } from './components/sidebar/Sidebar'
import { SidebarBackdrop } from './components/sidebar/SidebarBackdrop'
import { TopBar } from './components/topbar/TopBar'
import { useDarkMode } from './hooks/useDarkMode'
import { useGlobalShortcuts } from './hooks/useGlobalShortcuts'
import { usePanelDismiss } from './hooks/usePanelDismiss'
import { useSidebarClass } from './hooks/useSidebarClass'
import { useSettingsStore } from './store/useSettingsStore'
import { useUiStore } from './store/useUiStore'

export default function App() {
  // 全局副作用：主题 / 侧栏类名 / 快捷键 / 面板点击外关闭
  useDarkMode()
  useSidebarClass()
  useGlobalShortcuts()
  usePanelDismiss()

  // 首次进入且未配置 Key 时给出引导提示
  useEffect(() => {
    if (useSettingsStore.getState().settings.apiKey) return
    const timer = setTimeout(() => {
      useUiStore.getState().showToast('点击左下角 “···” 填入 DeepSeek API Key 后即可真实对话', 5200)
    }, 700)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <div id="app" className="app">
        <Sidebar />
        <SidebarBackdrop />
        <main className="main">
          <TopBar />
          <ChatScroll />
          <ComposerDock />
        </main>
      </div>
      <SettingsModal />
      <Toast />
    </>
  )
}
