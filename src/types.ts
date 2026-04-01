export interface Repo {
  id: number
  full_name: string
  owner: string
  name: string
  url: string
  description: string | null
  language: string | null
  stars: number
  forks: number
  open_issues: number
  watchers: number
  created_at: string
  updated_at: string
  pushed_at: string
  is_fork: boolean
  is_archived: boolean
  topics: string[]
  license: string | null
  homepage: string | null
  rank: number
}

export interface TrendingData {
  meta: {
    timestamp: string
    query: string
    filters: {
      createdAfter: string
      minStars: number
    }
    total_count: number
    collected_count: number
    source: string
  }
  repos: Repo[]
}

export type SortField = 'stars' | 'forks' | 'updated_at' | 'rank'
export type SortOrder = 'asc' | 'desc'

export function isRepo(data: unknown): data is Repo {
  if (typeof data !== 'object' || data === null) return false
  const obj = data as Record<string, unknown>
  return (
    typeof obj.id === 'number' &&
    typeof obj.full_name === 'string' &&
    typeof obj.owner === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.url === 'string' &&
    (typeof obj.description === 'string' || obj.description === null) &&
    typeof obj.stars === 'number' &&
    typeof obj.forks === 'number' &&
    Array.isArray(obj.topics)
  )
}

export function isTrendingData(data: unknown): data is TrendingData {
  if (typeof data !== 'object' || data === null) return false
  const obj = data as Record<string, unknown>
  return (
    typeof obj.meta === 'object' &&
    obj.meta !== null &&
    Array.isArray(obj.repos)
  )
}
