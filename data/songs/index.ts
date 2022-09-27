import type { Song, SongSlug } from "../../types"

import json from "./songs.json" assert { type: "json" }

export const songs: Song[] = json.value

export const songsMap: Map<SongSlug, Song> = new global.Map(
  songs.map((song) => [song.slug, song]),
)
