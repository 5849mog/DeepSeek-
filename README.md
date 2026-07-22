# DeepSeek Web（1:1 复刻 · React 重构版）

基于 **React 19 + TypeScript + Vite + Zustand** 重构的 DeepSeek 对话界面，像素级复刻官方 UI，
直连官方 OpenAI 兼容接口（`deepseek-v4-flash` / `deepseek-v4-pro`），支持流式输出、思考过程展示、
多会话管理、暗黑模式、附件本地预览、Markdown 导出。

> API Key 仅保存在访问者自己浏览器的 localStorage 中，纯静态站点，无任何服务器中转。

## 本地开发

```bash
npm install
npm run dev      # 开发服务器（热更新）
npm run build    # 产物输出到 dist/
npm run preview  # 本地预览构建产物
```

## 部署到 GitHub Pages（两种方式，任选其一）

### 方式一：GitHub Actions 自动部署（推荐）

1. 把本项目完整推送到你的 GitHub 仓库（`main` 分支）。
2. 仓库页面 → **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
3. 完成。之后每次 push 到 `main`，`.github/workflows/deploy.yml` 会自动构建并发布，
   访问地址为 `https://<你的用户名>.github.io/<仓库名>/`。

> 项目已配置 `base: './'`（相对路径），部署到任何仓库子路径都能正常加载资源，无需改动。

### 方式二：手动部署 dist 产物

1. 本地执行 `npm install && npm run build`。
2. 把 `dist/` 目录内容推送到仓库的 `gh-pages` 分支（或仓库根目录 / `docs` 目录）。
3. Settings → Pages → Source 选择对应分支即可。

## 使用

1. 打开站点，点击左下角 **「···」** 打开设置。
2. 填入你的 DeepSeek API Key（`sk-...`），保存。
3. 若浏览器直连遇到 CORS 拦截，把 Base URL 改成你自己的 OpenAI 兼容反向代理。
4. 开始对话：快速 / 专家 / 识图三种模式，支持深度思考开关、智能搜索开关。

## 项目结构

```
├── .github/workflows/deploy.yml   # GitHub Pages 自动部署
├── index.html                     # 入口 HTML
├── vite.config.ts                 # Vite 配置（base: './' 适配 Pages 子路径）
└── src/
    ├── main.tsx                   # 应用入口（样式引入 + 持久化初始化）
    ├── App.tsx                    # 根组件（布局 + 全局副作用挂载）
    ├── types/                     # 领域模型类型
    │   ├── chat.ts                #   消息 / 会话 / 模式
    │   └── settings.ts            #   设置
    ├── config/                    # 静态配置
    │   ├── defaults.ts            #   存储键 / 默认设置 / emoji 列表
    │   └── modes.ts               #   三种模式的行为配置
    ├── utils/                     # 纯工具函数
    │   ├── id.ts                  #   uid 生成
    │   ├── date.ts                #   时间分组标签
    │   ├── text.ts                #   HTML 转义 / 标题生成
    │   └── formatContent.ts       #   轻量 Markdown → HTML
    ├── services/                  # 副作用服务层
    │   ├── storage.ts             #   localStorage 读写与数据清洗
    │   ├── sse.ts                 #   SSE 流式响应解析
    │   ├── api.ts                 #   聊天补全请求 / 连接测试
    │   └── export.ts              #   会话导出 Markdown
    ├── store/                     # Zustand 状态层
    │   ├── useChatStore.ts        #   会话 / 消息 / 发送 / 流式更新
    │   ├── useSettingsStore.ts    #   API 与界面设置
    │   ├── useUiStore.ts          #   面板开关 / Toast / 附件 / 侧栏
    │   └── persistence.ts         #   状态变化自动持久化
    ├── hooks/                     # React hooks
    │   ├── useDarkMode.ts         #   body.dark-mode 同步
    │   ├── useSidebarClass.ts     #   body.sidebar-collapsed 同步
    │   ├── useMediaQuery.ts       #   响应式媒体查询
    │   ├── useGlobalShortcuts.ts  #   Esc / Cmd+K 快捷键
    │   ├── usePanelDismiss.ts     #   点击外部关闭浮动面板
    │   └── useAutoScroll.ts       #   消息自动滚动
    ├── styles/                    # 全局样式（按模块拆分）
    │   ├── variables.css          #   设计变量（亮/暗双主题）
    │   ├── base.css               #   基础与布局骨架
    │   ├── sidebar.css            #   侧边栏
    │   ├── topbar.css             #   顶栏
    │   ├── welcome.css            #   欢迎页与模式切换
    │   ├── messages.css           #   消息流 / 思考块 / 代码块
    │   ├── composer.css           #   输入区
    │   ├── panels.css             #   附件 / emoji 浮动面板
    │   ├── settings.css           #   设置弹窗
    │   ├── toast.css              #   Toast
    │   └── responsive.css         #   响应式与动效收敛
    └── components/                # 组件层
        ├── icons/                 #   19 个独立 SVG 图标组件
        ├── sidebar/               #   Sidebar / 搜索 / 会话列表 / 会话项 / 资料栏 / 遮罩
        ├── topbar/                #   顶栏
        ├── welcome/               #   欢迎页 / 模式分段控件
        ├── chat/                  #   滚动区 / 消息列表 / 用户消息 / AI 消息 / 思考块 / Markdown / 操作栏
        ├── composer/              #   输入底座 / 输入框 / 工具行 / 操作按钮 / 附件面板 / emoji 面板
        ├── settings/              #   设置弹窗 / 表单项
        └── common/                #   Toast
```
