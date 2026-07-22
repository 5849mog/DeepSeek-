import { useState } from 'react'
import { ConversationList } from './ConversationList'
import { ProfileBar } from './ProfileBar'
import { SidebarSearch } from './SidebarSearch'

/** 左侧边栏：搜索 + 历史会话 + 底部资料栏 */
export function Sidebar() {
  const [query, setQuery] = useState('')
  return (
    <aside id="sidebar" className="sidebar" aria-label="对话列表">
      <div className="side-top">
        <SidebarSearch query={query} onQueryChange={setQuery} />
        <ConversationList query={query} />
      </div>
      <ProfileBar />
    </aside>
  )
}
