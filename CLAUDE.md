# CLAUDE.md - 项目上下文

此文件为 Claude Code 提供项目级别的上下文指导。

## 项目概述

GitHub 热门仓库自动化采集项目，使用 GitHub Search API 搜索符合条件的仓库，并通过 Qwen AI 生成分析报告。

## 技术栈

- **运行时**: Node.js 22+
- **语言**: JavaScript (ES Module)
- **AI 服务**: Qwen (通义千问)
- **自动化**: GitHub Actions

## 常用命令

```bash
# 采集数据（默认模式）
npm run collect

# 分批采集（突破 1000 条限制）
npm run collect:batch

# 处理数据（AI 分析）
npm run process

# 测试 API 连通性
npm run test-api
```

## 环境变量

在 `.env` 文件中配置：

| 变量 | 说明 | 必填 |
|------|------|------|
| `QWEN_API_KEY` | 通义千问 API Key | ✅ |
| `GITHUB_TOKEN` | GitHub Token（可使用 `gh auth login`） | ✅ |

## GitHub Actions

### 定时任务

- **触发时间**: 每天 UTC 0:00（北京时间 8:00）
- **采集模式**: daily（增量，跳过已处理）

### 手动触发

在 GitHub Actions 页面选择 "Collect GitHub Trending"，可选：

| 模式 | 说明 |
|------|------|
| `daily` | 增量采集（默认） |
| `batch` | 分批采集（按 Stars 区间） |
| `full` | 完整采集 |

### Secrets 配置

需要在 GitHub 仓库 Settings → Secrets → Actions 中添加：

- `QWEN_API_KEY` - 通义千问 API Key

---

## ⚠️ 开发注意事项

### YAML 规范

**问题**: GitHub Actions 的 YAML 文件**不支持中文注释**，会导致解析失败。

```yaml
# ❌ 错误 - 会导致 workflow 解析失败
options:
  - daily      # 每日增量
  - batch      # 分批采集

# ✅ 正确 - 使用英文或无注释
options:
  - daily
  - batch
```

**原因**: GitHub Actions 使用的 YAML 解析器对非 ASCII 字符支持有限，中文注释可能导致编码问题。

**最佳实践**:
1. YAML 文件中**只使用英文**
2. 描述信息放在 `description` 字段中
3. 复杂逻辑的注释移到单独的文档中

### 相关文件

以下文件需要特别注意 YAML 规范：

- `.github/workflows/collect.yml`
- 其他 `.github/workflows/*.yml` 文件

---

## 项目结构

```
├── .github/workflows/
│   └── collect.yml      # GitHub Actions Workflow
├── scripts/
│   ├── collect.mjs      # 数据采集脚本（GitHub Search API）
│   ├── process.mjs      # AI 处理脚本
│   └── test-api.mjs     # API 测试脚本
├── output/
│   └── trending.json    # 采集的原始数据
├── trending/            # AI 分析结果（每个仓库一个目录）
└── .env                 # 环境变量
```

## 采集筛选条件

- **创建时间**: >= 2025-01-01
- **Stars 数**: >= 5000

## API 速率限制

| API | 限制 | 处理方式 |
|-----|------|----------|
| GitHub Search | 30 次/分钟 | 脚本内置 2.1 秒延迟 |
| Qwen | 按配额 | 每次请求间隔 1 秒 |
