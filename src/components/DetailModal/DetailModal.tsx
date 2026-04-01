import { X, Star, GitFork, TrendingUp, ExternalLink } from 'lucide-react'
import type { Repo } from '../../types'
import { formatNumber } from '../RepoCard/RepoCard'
import styles from './DetailModal.module.css'

interface DetailModalProps {
  repo: Repo | null
  open: boolean
  onClose: () => void
}

export function DetailModal({ repo, open, onClose }: DetailModalProps) {
  if (!open || !repo) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalTop}>
          <div className={styles.modalHeader}>
            <img
              className={styles.avatar}
              src={`https://github.com/${repo.owner}.png?size=56`}
              alt={repo.owner}
              width={28}
              height={28}
            />
            <span className={styles.owner}>{repo.owner}</span>
            <span className={styles.repoName}>{repo.name}</span>
          </div>
          <button className={styles.closeButton} onClick={onClose} aria-label="关闭">
            <X size={20} />
          </button>
        </div>

        <hr className={styles.divider} />

        <section className={styles.section}>
          <h4 className={styles.sectionTitle}>项目简介</h4>
          <p className={styles.desc}>{repo.description}</p>
        </section>

        <section className={styles.statsSection}>
          <div className={styles.statBox} style={{ '--stat-color': 'var(--accent-amber)' } as React.CSSProperties}>
            <Star size={18} />
            <span className={styles.statValue}>{formatNumber(repo.stars)}</span>
            <span className={styles.statLabel}>Stars</span>
          </div>
          <div className={styles.statBox} style={{ '--stat-color': 'var(--accent-blue)' } as React.CSSProperties}>
            <GitFork size={18} />
            <span className={styles.statValue}>{formatNumber(repo.forks)}</span>
            <span className={styles.statLabel}>Forks</span>
          </div>
          <div className={styles.statBox} style={{ '--stat-color': 'var(--accent-green)' } as React.CSSProperties}>
            <TrendingUp size={18} />
            <span className={styles.statValue}>#{repo.rank}</span>
            <span className={styles.statLabel}>Rank</span>
          </div>
        </section>

        {repo.topics.length > 0 && (
          <div className={styles.modalTags}>
            {repo.topics.map(topic => (
              <span key={topic} className={styles.tag}>{topic}</span>
            ))}
          </div>
        )}

        <hr className={styles.divider} />

        <div className={styles.modalActions}>
          <button className={styles.closeBtn} onClick={onClose}>关闭</button>
          <a
            className={styles.githubLink}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            访问 GitHub <ExternalLink size={14} />
          </a>
        </div>

        {repo.license && (
          <div className={styles.license}>
            License: {repo.license}
          </div>
        )}
      </div>
    </div>
  )
}
