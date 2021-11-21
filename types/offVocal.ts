import type { SongSlug } from "."

export type SongColumns = "slug" | "title" | "titleOfOffVocal"
export type AlbumColumns =
  | "albumTitle"
  | "publishedAt"
  | "albumDescription"
  | "albumURL"
  | "remarks"
export type Columns = SongColumns | AlbumColumns

export type Line = { [columnName in Columns]: string }

export type Song = { [key in SongColumns]: string } & {
  albums: Array<{ [key in AlbumColumns]: string }>
}

export type Songs = Map<SongSlug, Song>
