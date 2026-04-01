import { describe, it, expect } from 'vitest'
import { isRepo, isTrendingData } from './types'
import type { Repo, TrendingData } from './types'

const validRepo: Repo = {
  id: 1,
  full_name: 'vercel/next.js',
  owner: 'vercel',
  name: 'next.js',
  url: 'https://github.com/vercel/next.js',
  description: 'The React Framework',
  language: 'TypeScript',
  stars: 128300,
  forks: 27100,
  open_issues: 2800,
  watchers: 128300,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2026-03-31T00:00:00Z',
  pushed_at: '2026-03-31T00:00:00Z',
  is_fork: false,
  is_archived: false,
  topics: ['react', 'nextjs'],
  license: 'MIT',
  homepage: 'https://nextjs.org',
  rank: 1,
}

describe('isRepo 类型守卫', () => {
  it('验证有效的 Repo 对象', () => {
    expect(isRepo(validRepo)).toBe(true)
  })

  it('拒绝 null', () => {
    expect(isRepo(null)).toBe(false)
  })

  it('拒绝非对象', () => {
    expect(isRepo('string')).toBe(false)
    expect(isRepo(123)).toBe(false)
  })

  it('拒绝缺少必要字段的对象', () => {
    const { id, ...noId } = validRepo
    expect(isRepo(noId)).toBe(false)
  })

  it('接受 language 为 null', () => {
    expect(isRepo({ ...validRepo, language: null })).toBe(true)
  })

  it('接受 description 为 null', () => {
    expect(isRepo({ ...validRepo, description: null })).toBe(true)
  })
})

describe('isTrendingData 类型守卫', () => {
  const validData: TrendingData = {
    meta: {
      timestamp: '2026-03-31T01:23:31.743Z',
      query: 'created:>=2025-01-01 stars:>=5000',
      filters: { createdAfter: '2025-01-01', minStars: 5000 },
      total_count: 545,
      collected_count: 545,
      source: 'GitHub Search API',
    },
    repos: [validRepo],
  }

  it('验证有效的 TrendingData', () => {
    expect(isTrendingData(validData)).toBe(true)
  })

  it('拒绝 null', () => {
    expect(isTrendingData(null)).toBe(false)
  })

  it('拒绝缺少 repos 的对象', () => {
    const { repos, ...noRepos } = validData
    expect(isTrendingData(noRepos)).toBe(false)
  })
})
