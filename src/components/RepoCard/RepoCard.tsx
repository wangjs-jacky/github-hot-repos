import { Star, GitFork, TrendingUp } from 'lucide-react'
import type { Repo } from '../../types'
import styles from './RepoCard.module.css'

function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return n.toString()
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Shell: '#89e051',
  Dart: '#00B4AB',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Ruby: '#701516',
  PHP: '#4F5D95',
}

interface RepoCardProps {
  repo: Repo
  onViewDetail: (repo: Repo) => void
}

export function RepoCard({ repo, onViewDetail }: RepoCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.cardHeader}>
        <img
          className={styles.avatar}
          src={`https://github.com/${repo.owner}.png?size=56`}
          alt={repo.owner}
          width={28}
          height={28}
        />
        <span className={styles.owner}>{repo.owner}</span>
        {repo.language && (
          <>
            <span
              className={styles.languageDot}
              style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || '#8b8b96' }}
            />
            <span className={styles.languageName}>{repo.language}</span>
          </>
        )}
      </div>

      <h3 className={styles.repoName}>{repo.name}</h3>

      <p className={styles.repoDesc}>{repo.description}</p>

      {repo.topics.length > 0 && (
        <div className={styles.cardTags}>
          {repo.topics.slice(0, 3).map(topic => (
            <span key={topic} className={styles.tag}>{topic}</span>
          ))}
        </div>
      )}

      <div className={styles.cardFooter}>
        <div className={styles.stats}>
          <span className={styles.stat}>
            <Star size={14} />
            {formatNumber(repo.stars)}
          </span>
          <span className={styles.stat}>
            <GitFork size={14} />
            {formatNumber(repo.forks)}
          </span>
          <span className={styles.stat}>
            <TrendingUp size={14} />
            #{repo.rank}
          </span>
        </div>
        <button
          className={styles.viewButton}
          onClick={() => onViewDetail(repo)}
        >
          查看详情
        </button>
      </div>
    </article>
  )
}

export { formatNumber, LANGUAGE_COLORS }
