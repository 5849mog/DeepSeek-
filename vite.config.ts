import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' 使用相对路径构建产物，
// 保证部署到 GitHub Pages 的仓库子路径（https://<user>.github.io/<repo>/）下资源可正常加载。
export default defineConfig({
  base: './',
  plugins: [react()],
})
