import { readFile, writeFile } from "fs/promises"
import path from "path"
import { parse } from "csv-parse/sync"
import { pipe } from "fp-ts/lib/function.js"
import * as Ord from "fp-ts/lib/Ord.js"
import * as O from "fp-ts/lib/Option.js"
import * as A from "fp-ts/lib/Array.js"
import * as Map from "fp-ts/lib/Map.js"
import * as Set from "fp-ts/lib/Set.js"
import * as string from "fp-ts/lib/string.js"
import { songsMap } from "../data/songs.js"

import type { SongsMap } from "../types"
import type { Line, OffVocalSongs } from "../types/offVocal"

const getLines = async (): Promise<Line[]> => {
  const csv = await (
    await readFile(path.resolve("data", "offVocal.csv"))
  ).toString()
  return await parse(csv, { columns: true })
}

const findSongsWithNoOffVocals = (lines: Line[]): SongsMap => {
  const originalSongSlugs = pipe(
    songsMap,
    Map.keys(string.Ord),
    Set.fromArray(string.Eq),
  )
  const offVocalSongSlugs = pipe(
    lines,
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

const groupBySong = (lines: Line[]): OffVocalSongs => {
  return pipe(
    lines,
    A.reduce<Line, OffVocalSongs>(
      new global.Map(),
      (acc, { slug, titleOfOffVocal, ...album }) => {
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
          .map(({ albumTitle, publishedAt, albumURL, remarks }) =>
            `
- [${albumTitle}](${albumURL})

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
  const lines = await getLines()
  const songs = groupBySong(lines)
  const songsWithNoOffVocal = findSongsWithNoOffVocals(lines)
  const doc = docgen(songs, songsWithNoOffVocal)

  await writeFile(path.resolve("docs", "offVocal.md"), doc)
})()
