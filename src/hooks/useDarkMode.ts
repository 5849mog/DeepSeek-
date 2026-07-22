import { useEffect } from 'react'
import { useSettingsStore } from '../store/useSettingsStore'

/** 根据设置同步 body.dark-mode 类名 */
export function useDarkMode(): void {
  const darkMode = useSettingsStore((s) => s.settings.darkMode)
  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode)
  }, [darkMode])
}
