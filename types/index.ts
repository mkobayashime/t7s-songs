export type SongSlug = string

export type Song = Readonly<{
  slug: SongSlug
  /**
   * t7s.jp 上で id として利用されている数字
   */
  officialId: number
  title: string
  publishedAt: string
  description: string
  image: string
}>
