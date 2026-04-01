import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TagFilter } from './TagFilter'

describe('TagFilter', () => {
  const languages = ['CSS', 'Python', 'Rust', 'TypeScript']

  it('渲染所有语言标签', () => {
    render(<TagFilter languages={languages} selected="全部" onSelect={() => {}} />)
    expect(screen.getByText('全部')).toBeInTheDocument()
    languages.forEach(lang => {
      expect(screen.getByText(lang)).toBeInTheDocument()
    })
  })

  it('选中的标签有激活样式', () => {
    render(<TagFilter languages={languages} selected="Rust" onSelect={() => {}} />)
    const rustTag = screen.getByText('Rust')
    expect(rustTag.closest('button')).toHaveAttribute('data-active', 'true')
  })

  it('点击标签触发 onSelect 回调', async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(<TagFilter languages={languages} selected="全部" onSelect={onSelect} />)

    await user.click(screen.getByText('Python'))
    expect(onSelect).toHaveBeenCalledWith('Python')
  })

  it('"全部"标签始终在第一位', () => {
    render(<TagFilter languages={languages} selected="全部" onSelect={() => {}} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toHaveTextContent('全部')
  })
})
