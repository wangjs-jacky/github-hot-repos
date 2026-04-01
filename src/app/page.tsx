import { HomePage } from '@/components/HomePage'

const DATA_URL =
  'https://raw.githubusercontent.com/wangjs-jacky/github-hot-repos/main/output/trending.json'

export const revalidate = 3600 // 每小时重新生成

async function getTrendingData() {
  try {
    const res = await fetch(DATA_URL, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  } catch {
    return null
  }
}

export default async function Page() {
  const data = await getTrendingData()

  return <HomePage initialData={data} />
}
