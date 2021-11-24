import type { SongSlug } from "."

export type SongColumns = "slug" | "titleOfOffVocal"
export type AlbumColumns =
  | "albumTitle"
  | "publishedAt"
  | "albumDescription"
  | "albumURL"
  | "remarks"
export type Columns = SongColumns | AlbumColumns

export type Line = { [columnName in Columns]: string }

export type OffVocalSong = { [key in SongColumns]: string } & {
  title: string
} & {
  albums: Array<{ [key in AlbumColumns]: string }>
}

export type OffVocalSongs = Map<SongSlug, OffVocalSong>
