'use client'

import { useState, useMemo } from 'react'
import { Header } from './Header/Header'
import { TagFilter } from './TagFilter/TagFilter'
import { CardGrid } from './CardGrid/CardGrid'
import { DetailModal } from './DetailModal/DetailModal'
import type { Repo, TrendingData, SortField, SortOrder } from '../types'
import { isTrendingData } from '../types'
import styles from './HomePage.module.css'

interface HomePageProps {
  initialData: unknown
}

export function HomePage({ initialData }: HomePageProps) {
  const parsed = isTrendingData(initialData) ? (initialData as TrendingData) : null

  const [repos] = useState<Repo[]>(parsed?.repos ?? [])
  const [meta] = useState<TrendingData['meta'] | null>(parsed?.meta ?? null)
  const [loading] = useState(!parsed)
  const [error] = useState<string | null>(parsed ? null : '数据加载失败')
  const [search, setSearch] = useState('')
  const [language, setLanguage] = useState('全部')
  const [sortField, setSortField] = useState<SortField>('rank')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  const languages = useMemo(() => {
    const langs = repos
      .map((r) => r.language)
      .filter((l): l is string => l !== null && l !== 'Unknown')
    return [...new Set(langs)].sort()
  }, [repos])

  const filteredRepos = useMemo(() => {
    let result = repos

    if (language !== '全部') {
      result = result.filter((r) => r.language === language)
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim()
      result = result.filter(
        (r) =>
          r.full_name.toLowerCase().includes(q) ||
          (r.description?.toLowerCase()?.includes(q) ?? false) ||
          r.owner.toLowerCase().includes(q) ||
          r.topics.some((t) => t.toLowerCase().includes(q))
      )
    }

    result = [...result].sort((a, b) => {
      const modifier = sortOrder === 'desc' ? -1 : 1
      if (sortField === 'rank') return modifier * (a.rank - b.rank)
      if (sortField === 'stars') return modifier * (a.stars - b.stars)
      if (sortField === 'forks') return modifier * (a.forks - b.forks)
      if (sortField === 'updated_at')
        return modifier * a.updated_at.localeCompare(b.updated_at)
      return 0
    })

    return result
  }, [repos, language, search, sortField, sortOrder])

  const totalCount = repos.length

  function handleViewDetail(repo: Repo) {
    setSelectedRepo(repo)
    setModalOpen(true)
  }

  function handleCloseModal() {
    setModalOpen(false)
    setSelectedRepo(null)
  }

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  // 结构化数据用于 SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GitHub 热榜',
    description: '实时追踪 GitHub 上最热门的开源项目',
    url: 'https://github-hot-repos.vercel.app',
  }

  return (
    <div className={styles.app} data-theme={theme}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header
        search={search}
        onSearchChange={setSearch}
        totalCount={totalCount}
        updatedAt={meta?.timestamp ?? null}
        sortField={sortField}
        sortOrder={sortOrder}
        onSortFieldChange={(f) => setSortField(f as SortField)}
        onSortOrderChange={(o) => setSortOrder(o as 'asc' | 'desc')}
      />

      <div className={styles.filterRow}>
        <TagFilter
          languages={languages}
          selected={language}
          onSelect={setLanguage}
        />
        <button className={styles.themeToggle} onClick={toggleTheme}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      {loading && <div className={styles.loading}>加载中...</div>}
      {error && <div className={styles.error}>加载失败: {error}</div>}
      {!loading && !error && (
        <CardGrid repos={filteredRepos} onViewDetail={handleViewDetail} />
      )}

      <DetailModal
        repo={selectedRepo}
        open={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}
