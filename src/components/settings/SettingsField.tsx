import type { ReactNode } from 'react'

interface Props {
  label: string
  htmlFor: string
  children: ReactNode
}

/** 设置弹窗中的通用表单项（标签 + 控件） */
export function SettingsField({ label, htmlFor, children }: Props) {
  return (
    <div className="field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  )
}
