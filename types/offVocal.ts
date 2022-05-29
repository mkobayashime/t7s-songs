import type { SongSlug } from "."

type Album = {
  title: string
  publishedAt: string
  description: string
  url: string
  remarks: string
}

export type OffVocalItem = {
  slug: string
  titleOfOffVocal: string
  album: Album
}

export type OffVocalSong = {
  slug: string
  titleOfOffVocal: string
  title: string
  albums: Album[]
}

export type OffVocalSongs = Map<SongSlug, OffVocalSong>
