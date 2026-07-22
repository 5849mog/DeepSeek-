/** 生成短唯一 ID（时间戳 + 随机数，base36） */
export function uid(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`
}
