import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DetailModal } from './DetailModal'
import type { Repo } from '../../types'

const mockRepo: Repo = {
  id: 1,
  full_name: 'vercel/next.js',
  owner: 'vercel',
  name: 'next.js',
  url: 'https://github.com/vercel/next.js',
  description: 'The React Framework for the Web. Used by some of the world\'s largest companies.',
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
  topics: ['react', 'nextjs', 'framework', 'ssr'],
  license: 'MIT',
  homepage: 'https://nextjs.org',
  rank: 1,
}

describe('DetailModal', () => {
  it('open 时不渲染内容', () => {
    render(<DetailModal repo={null} open={false} onClose={() => {}} />)
    expect(screen.queryByText('next.js')).not.toBeInTheDocument()
  })

  it('渲染仓库详情', () => {
    render(<DetailModal repo={mockRepo} open={true} onClose={() => {}} />)
    expect(screen.getByText('next.js')).toBeInTheDocument()
    expect(screen.getByText(/React Framework/)).toBeInTheDocument()
    expect(screen.getByText('vercel')).toBeInTheDocument()
  })

  it('渲染统计数据', () => {
    render(<DetailModal repo={mockRepo} open={true} onClose={() => {}} />)
    expect(screen.getByText(/128.3k/)).toBeInTheDocument()
    expect(screen.getByText(/27.1k/)).toBeInTheDocument()
  })

  it('渲染 topics', () => {
    render(<DetailModal repo={mockRepo} open={true} onClose={() => {}} />)
    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByText('nextjs')).toBeInTheDocument()
    expect(screen.getByText('framework')).toBeInTheDocument()
    expect(screen.getByText('ssr')).toBeInTheDocument()
  })

  it('渲染访问 GitHub 按钮', () => {
    render(<DetailModal repo={mockRepo} open={true} onClose={() => {}} />)
    const link = screen.getByRole('link', { name: /访问 GitHub/ })
    expect(link).toHaveAttribute('href', 'https://github.com/vercel/next.js')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('点击关闭按钮触发 onClose', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<DetailModal repo={mockRepo} open={true} onClose={onClose} />)

    await user.click(screen.getByText('关闭'))
    expect(onClose).toHaveBeenCalled()
  })

  it('渲染 license 信息', () => {
    render(<DetailModal repo={mockRepo} open={true} onClose={() => {}} />)
    expect(screen.getByText(/License: MIT/)).toBeInTheDocument()
  })
})
