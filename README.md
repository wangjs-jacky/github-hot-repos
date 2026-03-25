# GitHub 热门仓库采集器

> 🚀 自动化采集 GitHub 热门仓库，使用 Qwen AI 生成分析报告

## 功能特性

- 🔍 **智能搜索** - 使用 GitHub Search API 搜索符合条件的仓库
- 🎯 **精准筛选** - 支持按创建时间、Stars 数、编程语言筛选
- 📊 **分批采集** - 突破 1000 条限制，按 Stars 区间分批获取
- 🤖 **AI 分析** - 使用 Qwen（通义千问）生成仓库分析报告
- ⏰ **定时采集** - GitHub Actions 自动运行

## 筛选条件

默认采集条件：
- **创建时间**：2025年1月1日以后
- **Stars 数**：≥ 5000

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 填入以下内容
QWEN_API_KEY=your_qwen_api_key
GITHUB_TOKEN=your_github_token  # 可选，也可使用 gh auth login 登录
```

### 3. 测试 API 连通性

```bash
npm run test-api
```

### 4. 运行采集

```bash
# 默认采集（最多 1000 条）
npm run collect

# 分批采集（突破 1000 条限制，按 Stars 区间分批）
npm run collect:batch

# 只采集 TypeScript 项目
npm run collect:ts

# 只采集 Python 项目
npm run collect:py
```

## 命令行选项

```bash
node scripts/collect.mjs [选项]

选项:
  --batch, -b          分批采集（按 stars 区间，可获取更多结果）
  --created-after, -c  创建时间筛选（默认: 2025-01-01）
  --min-stars, -s      最小 stars 数（默认: 5000）
  --language, -l       语言筛选（如: TypeScript, Python）
  --max-pages, -p      每个区间的最大页数（默认: 10）
  --help, -h           显示帮助信息
```

### 示例

```bash
# 采集 2025年3月后创建的项目
node scripts/collect.mjs -c 2025-03-01

# 采集 Stars > 10000 的项目
node scripts/collect.mjs -s 10000

# 采集 Go 语言项目，限制 5 页
node scripts/collect.mjs -l Go -p 5
```

## 项目结构

```
├── .github/workflows/
│   └── collect.yml      # GitHub Actions Workflow
├── scripts/
│   ├── collect.mjs      # 数据采集脚本（GitHub Search API）
│   ├── process.mjs      # AI 处理脚本
│   ├── test-api.mjs     # API 测试脚本
│   └── __tests__/       # 测试用例
├── output/              # 采集的数据（JSON）
│   └── trending.json
├── trending/            # AI 分析结果（Markdown）
│   └── owner-repo/
│       └── README.md
└── .env                 # 环境变量
```

## GitHub API 速率限制

| API 类型 | 限制 | 说明 |
|----------|------|------|
| Search API | 30 次/分钟 | 主要瓶颈 |
| Core API | 5000 次/小时 | 充足 |

脚本已内置速率限制处理，每次请求间隔 2.1 秒。

## GitHub Actions 自动化

### 定时任务

- **触发时间**：每天 UTC 0:00（北京时间 8:00）
- **采集模式**：增量采集（跳过已处理的仓库）

### 手动触发

在 GitHub Actions 页面选择 "Collect GitHub Trending" workflow，可选择：

| 参数 | 说明 |
|------|------|
| **mode** | `daily` - 增量采集<br>`batch` - 分批采集（按 Stars 区间）<br>`full` - 完整采集 |
| **language** | 语言筛选（留空为全部） |

### Secrets 配置

在仓库 Settings → Secrets and variables → Actions 中添加：

| Secret | 说明 |
|--------|------|
| `QWEN_API_KEY` | 通义千问 API Key（必填） |
| `GITHUB_TOKEN` | 自动提供，无需配置 |

### 执行流程

1. 采集 GitHub 热门仓库数据（创建时间 ≥ 2025-01-01，Stars ≥ 5000）
2. 调用 Qwen API 生成分析报告
3. 自动提交到仓库

## 许可证

MIT
