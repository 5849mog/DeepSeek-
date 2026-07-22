/** 会话列表的时间分组标签：今天 / 昨天 / 30 天内 / 更早 */
export function dayLabel(ts: number): string {
  const now = new Date()
  const d = new Date(ts)
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const startDay = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const diff = Math.round((startToday - startDay) / 86400000)
  if (diff <= 0) return '今天'
  if (diff === 1) return '昨天'
  if (diff <= 30) return '30 天内'
  return '更早'
}
