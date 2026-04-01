# PLAN — GitHub 热榜功能实现

## 技术栈

- Vite 6 + React 19 + TypeScript
- Vitest + React Testing Library (TDD)
- CSS Modules + CSS Variables (主题)
- Lucide React (图标)

## 受影响文件清单

### 新建文件 (14)

| 文件 | 类型 | 说明 |
|------|------|------|
| `package.json` | config | 项目依赖配置 |
| `vite.config.ts` | config | Vite 配置 |
| `tsconfig.json` | config | TypeScript 配置 |
| `vitest.config.ts` | config | Vitest 测试配置 |
| `index.html` | entry | HTML 入口 |
| `src/main.tsx` | entry | React 入口 |
| `src/App.tsx` | component | 主应用组件 |
| `src/types.ts` | types | 数据类型定义 |
| `src/hooks/useRepos.ts` | hook | 数据获取+筛选 hook |
| `src/components/Header/Header.tsx` | component | 头部（Logo+搜索+统计） |
| `src/components/TagFilter/TagFilter.tsx` | component | 语言标签筛选 |
| `src/components/RepoCard/RepoCard.tsx` | component | 仓库卡片（可复用） |
| `src/components/CardGrid/CardGrid.tsx` | component | 3列卡片网格 |
| `src/components/DetailModal/DetailModal.tsx` | component | 详情弹窗 |

### 新建测试文件 (5)

| 文件 | 说明 |
|------|------|
| `src/types.test.ts` | 类型守卫测试 |
| `src/hooks/useRepos.test.ts` | 数据获取+筛选测试 |
| `src/components/RepoCard/RepoCard.test.tsx` | 卡片渲染测试 |
| `src/components/TagFilter/TagFilter.test.tsx` | 筛选交互测试 |
| `src/components/DetailModal/DetailModal.test.tsx` | 弹窗交互测试 |

### 样式文件 (7)

| 文件 | 说明 |
|------|------|
| `src/styles/variables.css` | CSS 变量（深色/浅色主题） |
| `src/styles/global.css` | 全局样式 |
| `src/App.module.css` | App 布局样式 |
| `src/components/Header/Header.module.css` | Header 样式 |
| `src/components/TagFilter/TagFilter.module.css` | 筛选标签样式 |
| `src/components/RepoCard/RepoCard.module.css` | 卡片样式 |
| `src/components/DetailModal/DetailModal.module.css` | 弹窗样式 |

## 执行顺序

### Phase 1: 项目初始化
1. 初始化 Vite + React + TS 项目
2. 安装依赖: vitest, @testing-library/react, @testing-library/jest-dom, jsdom, lucide-react
3. 配置 vitest.config.ts
4. 创建基础目录结构

### Phase 2: 数据层 (TDD)
1. **Red**: 写 `src/types.test.ts` — 测试类型定义
2. **Green**: 实现 `src/types.ts` — Repo, TrendingData 类型
3. **Red**: 写 `src/hooks/useRepos.test.ts` — 测试数据获取、搜索筛选、排序
4. **Green**: 实现 `src/hooks/useRepos.ts` — 数据获取 + 筛选逻辑

### Phase 3: 基础 UI (TDD)
1. **Red**: 写 `src/components/TagFilter/TagFilter.test.tsx` — 测试标签渲染和点击交互
2. **Green**: 实现 `TagFilter` 组件 + 样式
3. **Red**: 写 `src/components/RepoCard/RepoCard.test.tsx` — 测试卡片渲染
4. **Green**: 实现 `RepoCard` 组件 + 样式

### Phase 4: 组合 UI (TDD)
1. **Red**: 写 `src/components/DetailModal/DetailModal.test.tsx` — 测试弹窗开关和内容
2. **Green**: 实现 `DetailModal` 组件 + 样式
3. 实现 `Header` 组件 + 样式
4. 实现 `CardGrid` 组件
5. 组装 `App.tsx` + 主题系统

### Phase 5: 集成验证
1. 运行全部测试
2. 启动开发服务器，视觉验证
3. 检查深色/浅色主题切换

## 风险与回退

| 风险 | 影响 | 回退方案 |
|------|------|----------|
| trending.json 体积过大（545条） | 首屏加载慢 | 前端分页或虚拟滚动 |
| GitHub raw URL 被限流 | 数据获取失败 | 内嵌备用数据 |
| CSS 变量兼容性 | 旧浏览器样式错乱 | postcss-preset-env polyfill |
| 测试中的 fetch mock | 测试不稳定 | 使用 msw 或 vitest mock |

## 验收标准

1. 所有测试通过 (vitest run)
2. 页面展示 545 个热门仓库
3. 搜索功能：按仓库名/描述搜索
4. 语言筛选：点击标签筛选对应语言
5. 排序：Stars/Forks/最近更新
6. 详情弹窗：点击"查看详情"弹出
7. 深色/浅色主题切换
8. 响应式布局：3列 → 2列 → 1列
