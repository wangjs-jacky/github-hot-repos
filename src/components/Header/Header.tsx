import { Search, ArrowUpDown, SlidersHorizontal } from 'lucide-react'
import styles from './Header.module.css'

interface HeaderProps {
  search: string
  onSearchChange: (value: string) => void
  totalCount: number
  updatedAt: string | null
  sortField: string
  sortOrder: string
  onSortFieldChange: (field: string) => void
  onSortOrderChange: (order: string) => void
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function Header({
  search, onSearchChange, totalCount, updatedAt,
  sortField, sortOrder, onSortFieldChange, onSortOrderChange,
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🔥</span>
          <h1 className={styles.logoText}>GitHub 热榜</h1>
        </div>
        <div className={styles.searchBar}>
          <Search size={16} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="搜索仓库、描述、作者..."
            value={search}
            onChange={e => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.statsRow}>
        <span className={styles.statItem}>
          共 <strong>{totalCount}</strong> 个仓库
        </span>
        {updatedAt && (
          <span className={styles.statItem}>
            更新于 {formatDate(updatedAt)}
          </span>
        )}
        <div className={styles.sortControls}>
          <SlidersHorizontal size={14} />
          <select
            className={styles.sortSelect}
            value={sortField}
            onChange={e => onSortFieldChange(e.target.value)}
          >
            <option value="rank">默认排序</option>
            <option value="stars">Stars</option>
            <option value="forks">Forks</option>
            <option value="updated_at">最近更新</option>
          </select>
          <button
            className={styles.sortOrderButton}
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            title={sortOrder === 'asc' ? '升序' : '降序'}
          >
            <ArrowUpDown size={14} />
          </button>
        </div>
      </div>
    </header>
  )
}
