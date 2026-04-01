import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GitHub 热榜 - 发现最热门的开源项目',
  description:
    '实时追踪 GitHub 上最热门的开源项目，按 Stars、Forks、活跃度排序，发现优质开源项目。支持按语言筛选、关键词搜索。',
  keywords: [
    'GitHub',
    '热榜',
    '开源项目',
    'GitHub Trending',
    '热门仓库',
    '开源',
    '编程',
    '开发者',
  ],
  authors: [{ name: 'Jacky Wang', url: 'https://github.com/wangjs-jacky' }],
  openGraph: {
    title: 'GitHub 热榜 - 发现最热门的开源项目',
    description:
      '实时追踪 GitHub 上最热门的开源项目，按 Stars、Forks、活跃度排序。',
    type: 'website',
    locale: 'zh_CN',
    siteName: 'GitHub 热榜',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GitHub 热榜 - 发现最热门的开源项目',
    description:
      '实时追踪 GitHub 上最热门的开源项目，按 Stars、Forks、活跃度排序。',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://github-hot-repos.vercel.app',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link
          rel="icon"
          type="image/svg+xml"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔥</text></svg>"
        />
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
}
