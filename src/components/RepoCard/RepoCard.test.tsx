import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RepoCard } from './RepoCard'
import type { Repo } from '../../types'

const mockRepo: Repo = {
  id: 1,
  full_name: 'vercel/next.js',
  owner: 'vercel',
  name: 'next.js',
  url: 'https://github.com/vercel/next.js',
  description: 'The React Framework for the Web',
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
  topics: ['react', 'nextjs', 'framework'],
  license: 'MIT',
  homepage: 'https://nextjs.org',
  rank: 1,
}

describe('RepoCard', () => {
  it('渲染仓库名称和描述', () => {
    render(<RepoCard repo={mockRepo} onViewDetail={() => {}} />)
    expect(screen.getByText('next.js')).toBeInTheDocument()
    expect(screen.getByText('The React Framework for the Web')).toBeInTheDocument()
  })

  it('渲染 owner 头像和名称', () => {
    render(<RepoCard repo={mockRepo} onViewDetail={() => {}} />)
    expect(screen.getByText('vercel')).toBeInTheDocument()
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('渲染语言标签', () => {
    render(<RepoCard repo={mockRepo} onViewDetail={() => {}} />)
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('渲染星标和 fork 数', () => {
    render(<RepoCard repo={mockRepo} onViewDetail={() => {}} />)
    expect(screen.getByText(/128.3k/)).toBeInTheDocument()
    expect(screen.getByText(/27.1k/)).toBeInTheDocument()
  })

  it('渲染 topics 标签', () => {
    render(<RepoCard repo={mockRepo} onViewDetail={() => {}} />)
    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByText('nextjs')).toBeInTheDocument()
  })

  it('点击"查看详情"触发回调', async () => {
    const user = userEvent.setup()
    const onViewDetail = vi.fn()
    render(<RepoCard repo={mockRepo} onViewDetail={onViewDetail} />)

    await user.click(screen.getByRole('button', { name: /查看详情/ }))
    expect(onViewDetail).toHaveBeenCalledWith(mockRepo)
  })

  it('语言为 null 时不渲染语言标签', () => {
    const noLangRepo = { ...mockRepo, language: null }
    render(<RepoCard repo={noLangRepo} onViewDetail={() => {}} />)
    expect(screen.queryByText('TypeScript')).not.toBeInTheDocument()
  })
})
