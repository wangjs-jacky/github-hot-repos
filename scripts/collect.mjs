#!/usr/bin/env node

/**
 * GitHub 热门仓库采集脚本
 * 使用 GitHub Search API 搜索符合条件的仓库
 *
 * 筛选条件：
 * - 创建时间 >= 2025-01-01
 * - Stars > 5000
 */

import 'dotenv/config';
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { execSync } from 'child_process';

// 配置
const CONFIG = {
  // 筛选条件
  filters: {
    createdAfter: '2025-01-01',  // 创建时间 >= 2025-01-01
    minStars: 5000,              // 最小 stars 数
    maxStars: null,              // 最大 stars 数（可选，用于分批获取）
  },
  // API 配置
  api: {
    perPage: 100,                // 每页结果数（最大 100）
    maxPages: 10,                // 最大页数（Search API 最多返回 1000 条）
    rateLimitDelay: 2100,        // 速率限制延迟（30次/分钟 ≈ 2秒/次，加缓冲）
  },
  // 输出配置
  output: {
    dir: 'output',
    file: 'trending.json',
  }
};

/**
 * 获取 GitHub Token
 */
function getGitHubToken() {
  // 优先使用环境变量
  if (process.env.GITHUB_TOKEN) {
    return process.env.GITHUB_TOKEN;
  }

  // 尝试从 gh CLI 获取
  try {
    return execSync('gh auth token', { encoding: 'utf-8' }).trim();
  } catch {
    console.error('❌ 无法获取 GitHub Token，请设置 GITHUB_TOKEN 环境变量或使用 gh auth login 登录');
    process.exit(1);
  }
}

/**
 * 构建 GitHub Search 查询
 */
function buildSearchQuery(options = {}) {
  const { createdAfter, minStars, maxStars, language } = options;

  let query = [];

  // 创建时间筛选
  if (createdAfter) {
    query.push(`created:>=${createdAfter}`);
  }

  // Stars 筛选
  if (minStars && maxStars) {
    query.push(`stars:${minStars}..${maxStars}`);
  } else if (minStars) {
    query.push(`stars:>=${minStars}`);
  }

  // 语言筛选（可选）
  if (language) {
    query.push(`language:${language}`);
  }

  return query.join(' ');
}

/**
 * 调用 GitHub Search API
 */
async function searchRepositories(query, page = 1, token) {
  const params = new URLSearchParams({
    q: query,
    sort: 'stars',
    order: 'desc',
    per_page: CONFIG.api.perPage,
    page: page,
  });

  const url = `https://api.github.com/search/repositories?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Trending-Collector',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (response.status === 403) {
      const rateLimit = response.headers.get('X-RateLimit-Remaining');
      const resetTime = response.headers.get('X-RateLimit-Reset');
      throw new Error(`速率限制！剩余: ${rateLimit}, 重置时间: ${new Date(resetTime * 1000).toLocaleString()}`);
    }
    throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * 获取当前速率限制
 */
async function getRateLimit(token) {
  const response = await fetch('https://api.github.com/rate_limit', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.resources.search;
}

/**
 * 格式化仓库数据
 */
function formatRepo(item) {
  return {
    id: item.id,
    full_name: item.full_name,
    owner: item.owner.login,
    name: item.name,
    url: item.html_url,
    description: item.description,
    language: item.language || 'Unknown',
    stars: item.stargazers_count,
    forks: item.forks_count,
    open_issues: item.open_issues_count,
    watchers: item.watchers_count,
    created_at: item.created_at,
    updated_at: item.updated_at,
    pushed_at: item.pushed_at,
    is_fork: item.fork,
    is_archived: item.archived,
    topics: item.topics || [],
    license: item.license?.spdx_id || null,
    homepage: item.homepage,
  };
}

/**
 * 延迟函数
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 采集热门仓库
 */
async function collectTrending(options = {}) {
  const token = getGitHubToken();
  const timestamp = new Date().toISOString();

  // 检查速率限制
  console.log('🔍 检查 GitHub API 速率限制...');
  const rateLimit = await getRateLimit(token);
  if (rateLimit) {
    console.log(`   Search API: ${rateLimit.remaining}/${rateLimit.limit} 剩余`);
    if (rateLimit.remaining < 5) {
      const resetTime = new Date(rateLimit.reset * 1000);
      console.log(`   ⚠️  速率限制即将用尽，将在 ${resetTime.toLocaleString()} 重置`);
    }
  }

  // 构建查询
  const queryOptions = {
    createdAfter: options.createdAfter || CONFIG.filters.createdAfter,
    minStars: options.minStars || CONFIG.filters.minStars,
    maxStars: options.maxStars,
    language: options.language,
  };

  const query = buildSearchQuery(queryOptions);
  console.log(`\n📊 搜索查询: "${query}"`);

  // 分页获取结果
  const allRepos = [];
  let total_count = 0;
  let page = 1;
  const maxPages = options.maxPages || CONFIG.api.maxPages;

  while (page <= maxPages) {
    console.log(`\n📄 获取第 ${page} 页...`);

    try {
      const data = await searchRepositories(query, page, token);

      if (page === 1) {
        total_count = data.total_count;
        console.log(`   找到 ${total_count.toLocaleString()} 个符合条件的仓库`);
      }

      if (!data.items || data.items.length === 0) {
        console.log('   没有更多数据了');
        break;
      }

      const formattedRepos = data.items.map(formatRepo);
      allRepos.push(...formattedRepos);
      console.log(`   获取 ${formattedRepos.length} 个仓库，累计 ${allRepos.length} 个`);

      // 检查是否还有更多页
      if (data.items.length < CONFIG.api.perPage) {
        console.log('   已获取所有结果');
        break;
      }

      page++;

      // 速率限制延迟
      if (page <= maxPages) {
        console.log(`   等待 ${CONFIG.api.rateLimitDelay / 1000} 秒（避免速率限制）...`);
        await delay(CONFIG.api.rateLimitDelay);
      }

    } catch (error) {
      console.error(`   ❌ 错误: ${error.message}`);
      break;
    }
  }

  // 添加排名
  allRepos.forEach((repo, index) => {
    repo.rank = index + 1;
  });

  // 生成结果
  const result = {
    meta: {
      timestamp,
      query,
      filters: queryOptions,
      total_count,
      collected_count: allRepos.length,
      source: 'GitHub Search API',
    },
    repos: allRepos,
  };

  // 确保输出目录存在
  if (!existsSync(CONFIG.output.dir)) {
    mkdirSync(CONFIG.output.dir, { recursive: true });
  }

  // 保存结果
  const outputPath = `${CONFIG.output.dir}/${CONFIG.output.file}`;
  writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(`\n✅ 已保存 ${allRepos.length} 个仓库到 ${outputPath}`);

  return result;
}

/**
 * 分批采集（按 stars 区间）
 * 用于获取更多结果（突破 1000 条限制）
 */
async function collectInBatches(options = {}) {
  const token = getGitHubToken();
  const timestamp = new Date().toISOString();

  console.log('🔄 开始分批采集...\n');

  // Stars 区间配置
  const starRanges = [
    { min: 100000, max: null },      // 100k+
    { min: 50000, max: 100000 },     // 50k-100k
    { min: 20000, max: 50000 },      // 20k-50k
    { min: 10000, max: 20000 },      // 10k-20k
    { min: 5000, max: 10000 },       // 5k-10k
  ];

  const allRepos = [];
  const collectedIds = new Set();

  for (const range of starRanges) {
    const rangeLabel = range.max
      ? `${(range.min / 1000).toFixed(0)}k-${(range.max / 1000).toFixed(0)}k stars`
      : `${(range.min / 1000).toFixed(0)}k+ stars`;

    console.log(`\n📦 采集区间: ${rangeLabel}`);

    const queryOptions = {
      createdAfter: options.createdAfter || CONFIG.filters.createdAfter,
      minStars: range.min,
      maxStars: range.max,
      language: options.language,
    };

    const query = buildSearchQuery(queryOptions);
    console.log(`   查询: "${query}"`);

    let page = 1;
    let rangeCount = 0;

    while (page <= CONFIG.api.maxPages) {
      try {
        const data = await searchRepositories(query, page, token);

        if (page === 1) {
          console.log(`   找到 ${data.total_count.toLocaleString()} 个仓库`);
        }

        if (!data.items || data.items.length === 0) {
          break;
        }

        // 去重
        const newRepos = data.items
          .map(formatRepo)
          .filter(repo => !collectedIds.has(repo.id));

        newRepos.forEach(repo => collectedIds.add(repo.id));
        allRepos.push(...newRepos);
        rangeCount += newRepos.length;

        console.log(`   第 ${page} 页: +${newRepos.length} 个，区间累计 ${rangeCount} 个`);

        if (data.items.length < CONFIG.api.perPage) {
          break;
        }

        page++;
        await delay(CONFIG.api.rateLimitDelay);

      } catch (error) {
        console.error(`   ❌ 错误: ${error.message}`);
        break;
      }
    }

    // 区间间延迟
    console.log(`   区间完成，累计总数: ${allRepos.length} 个`);
    await delay(CONFIG.api.rateLimitDelay);
  }

  // 按 stars 排序并添加排名
  allRepos.sort((a, b) => b.stars - a.stars);
  allRepos.forEach((repo, index) => {
    repo.rank = index + 1;
  });

  // 生成结果
  const result = {
    meta: {
      timestamp,
      filters: {
        createdAfter: options.createdAfter || CONFIG.filters.createdAfter,
        minStars: CONFIG.filters.minStars,
      },
      total_count: allRepos.length,
      source: 'GitHub Search API (Batch)',
    },
    repos: allRepos,
  };

  // 保存结果
  if (!existsSync(CONFIG.output.dir)) {
    mkdirSync(CONFIG.output.dir, { recursive: true });
  }

  const outputPath = `${CONFIG.output.dir}/${CONFIG.output.file}`;
  writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(`\n✅ 分批采集完成！共 ${allRepos.length} 个仓库，已保存到 ${outputPath}`);

  return result;
}

// CLI 入口
if (process.argv[1] === import.meta.url.replace('file://', '')) {
  const args = process.argv.slice(2);
  const options = {};

  // 解析命令行参数
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--batch' || arg === '-b') {
      options.batch = true;
    } else if (arg === '--created-after' || arg === '-c') {
      options.createdAfter = args[++i];
    } else if (arg === '--min-stars' || arg === '-s') {
      options.minStars = parseInt(args[++i]);
    } else if (arg === '--language' || arg === '-l') {
      options.language = args[++i];
    } else if (arg === '--max-pages' || arg === '-p') {
      options.maxPages = parseInt(args[++i]);
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
GitHub 热门仓库采集工具

用法: node scripts/collect.mjs [选项]

选项:
  --batch, -b          分批采集（按 stars 区间，可获取更多结果）
  --created-after, -c  创建时间筛选（默认: 2025-01-01）
  --min-stars, -s      最小 stars 数（默认: 5000）
  --language, -l       语言筛选（如: TypeScript, Python）
  --max-pages, -p      每个区间的最大页数（默认: 10）
  --help, -h           显示帮助信息

示例:
  node scripts/collect.mjs                    # 默认采集
  node scripts/collect.mjs --batch            # 分批采集（更多结果）
  node scripts/collect.mjs -l TypeScript      # 只采集 TypeScript 项目
  node scripts/collect.mjs -c 2025-03-01      # 3月后创建的项目
`);
      process.exit(0);
    }
  }

  // 执行采集
  if (options.batch) {
    collectInBatches(options).catch(err => {
      console.error('Error:', err.message);
      process.exit(1);
    });
  } else {
    collectTrending(options).catch(err => {
      console.error('Error:', err.message);
      process.exit(1);
    });
  }
}

export { collectTrending, collectInBatches, buildSearchQuery };
