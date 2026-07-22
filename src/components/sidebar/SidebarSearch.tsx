import { SearchIcon } from '../icons/SearchIcon'

interface Props {
  query: string
  onQueryChange: (value: string) => void
}

/** 会话搜索框 */
export function SidebarSearch({ query, onQueryChange }: Props) {
  return (
    <label className="search" htmlFor="searchInput">
      <SearchIcon />
      <input
        id="searchInput"
        placeholder="搜索对话内容..."
        autoComplete="off"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
      />
    </label>
  )
}
