import * as A from "fp-ts/lib/Array.js"
import { pipe } from "fp-ts/lib/function.js"
import * as Map from "fp-ts/lib/Map.js"
import * as O from "fp-ts/lib/Option.js"
import * as Ord from "fp-ts/lib/Ord.js"
import * as Set from "fp-ts/lib/Set.js"
import * as string from "fp-ts/lib/string.js"
import { writeFile } from "fs/promises"
import path from "path"

import { offVocals } from "../data/offVocal"
import { songsMap } from "../data/songs"
import type { SongsMap } from "../types"
import type { OffVocalSongs, OffVocalItem } from "../types/offVocal"

const findSongsWithNoOffVocals = (items: OffVocalItem[]): SongsMap => {
  const originalSongSlugs = pipe(
    songsMap,
    Map.keys(string.Ord),
    Set.fromArray(string.Eq),
  )
  const offVocalSongSlugs = pipe(
    items,
    A.map(({ slug }) => slug),
    Set.fromArray(string.Eq),
  )
  const songsWithNoOffVocalSlugs = pipe(
    originalSongSlugs,
    Set.difference(string.Eq)(offVocalSongSlugs),
  )

  return pipe(
    songsMap,
    Map.filter(({ slug }) =>
      pipe(songsWithNoOffVocalSlugs, Set.elem(string.Eq)(slug)),
    ),
  )
}

const groupBySong = (items: OffVocalItem[]): OffVocalSongs => {
  return pipe(
    items,
    A.reduce<OffVocalItem, OffVocalSongs>(
      new global.Map(),
      (acc, { slug, titleOfOffVocal, album }) => {
        const song = pipe(acc, Map.lookup(string.Eq)(slug))

        const originalSong = songsMap.get(slug)
        if (!originalSong)
          throw new Error(`Song with slug "${slug}" not found.`)

        return pipe(
          acc,
          Map.upsertAt(string.Eq)(slug, {
            slug,
            title: originalSong.title,
            titleOfOffVocal,
            albums: O.isSome(song) ? [...song.value.albums, album] : [album],
          }),
        )
      },
    ),
  )
}

const docgen = (
  offVocalSongs: OffVocalSongs,
  songsWithNoOffVocal: SongsMap,
): string => {
  return [
    "# ナナシス楽曲オフボーカル音源まとめ",
    "## オフボーカル音源未発売",
    pipe(
      songsWithNoOffVocal,
      Map.values(
        pipe(
          string.Ord,
          Ord.contramap(({ slug }) => slug),
        ),
      ),
      A.map(({ title }) => `- ${title}`),
    ).join("\n\n"),
    pipe(
      offVocalSongs,
      Map.values(
        pipe(
          string.Ord,
          Ord.contramap(({ slug }) => slug),
        ),
      ),
      A.map(({ title, titleOfOffVocal, albums }) => {
        const albumsMd = albums
          .map(({ title, publishedAt, url, remarks }) =>
            `
- [${title}](${url})

  ${publishedAt}発売

  ${remarks}
            `.trim(),
          )
          .join("\n\n")

        return `
## ${title}

\`${titleOfOffVocal}\`

### 収録アルバム

${albumsMd}
    `.trim()
      }),
    ).join("\n\n"),
  ].join("\n\n")
}

//
;(async () => {
  const songs = groupBySong(offVocals)
  const songsWithNoOffVocal = findSongsWithNoOffVocals(offVocals)

  const doc = docgen(songs, songsWithNoOffVocal)

  await writeFile(path.resolve("docs", "offVocal.md"), doc)
})()
