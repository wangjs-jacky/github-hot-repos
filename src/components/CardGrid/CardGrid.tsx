import type { Repo } from '../../types'
import { RepoCard } from '../RepoCard/RepoCard'
import styles from './CardGrid.module.css'

interface CardGridProps {
  repos: Repo[]
  onViewDetail: (repo: Repo) => void
}

export function CardGrid({ repos, onViewDetail }: CardGridProps) {
  return (
    <div className={styles.grid}>
      {repos.map(repo => (
        <RepoCard key={repo.id} repo={repo} onViewDetail={onViewDetail} />
      ))}
    </div>
  )
}
