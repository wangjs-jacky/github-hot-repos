import styles from './TagFilter.module.css'

interface TagFilterProps {
  languages: string[]
  selected: string
  onSelect: (language: string) => void
}

export function TagFilter({ languages, selected, onSelect }: TagFilterProps) {
  const allTags = ['全部', ...languages]

  return (
    <div className={styles.filter}>
      {allTags.map(tag => (
        <button
          key={tag}
          className={styles.tag}
          data-active={selected === tag}
          onClick={() => onSelect(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
