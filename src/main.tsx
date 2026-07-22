import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { initPersistence } from './store/persistence'

// 样式（按层叠顺序引入）
import './styles/variables.css'
import './styles/base.css'
import './styles/sidebar.css'
import './styles/topbar.css'
import './styles/welcome.css'
import './styles/messages.css'
import './styles/composer.css'
import './styles/panels.css'
import './styles/settings.css'
import './styles/toast.css'
import './styles/responsive.css'

// 状态变化自动写回 localStorage
initPersistence()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
