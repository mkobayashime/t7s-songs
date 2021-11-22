import { readFile, writeFile } from "fs/promises"
import path from "path"
import { parse } from "csv-parse/sync"
import { pipe } from "fp-ts/lib/function.js"
import * as O from "fp-ts/lib/Option.js"
import * as A from "fp-ts/lib/Array.js"
import * as Map from "fp-ts/lib/Map.js"
import * as string from "fp-ts/lib/string.js"

import type { Line, Songs } from "../types/offVocal"

const getLines = async (): Promise<Line[]> => {
  const csv = await (
    await readFile(path.resolve("data", "offVocal.csv"))
  ).toString()
  return await parse(csv, { columns: true })
}

const groupBySong = (lines: Line[]): Songs => {
  return pipe(
    lines,
    A.reduce<Line, Songs>(
      new global.Map(),
      (acc, { slug, title, titleOfOffVocal, ...album }) => {
        const song = pipe(acc, Map.lookup(string.Eq)(slug))

        return pipe(
          acc,
          Map.upsertAt(string.Eq)(slug, {
            slug,
            title,
            titleOfOffVocal,

            albums: O.isSome(song) ? [...song.value.albums, album] : [album],
          }),
        )
      },
    ),
  )
}

const docgen = (songs: Songs): string => {
  return (
    "# ナナシス楽曲オフボーカル音源まとめ\n\n" +
    pipe(
      songs,
      Map.toArray(string.Ord),
      A.map(([_, { title, titleOfOffVocal, albums }]) => {
        const albumsMd = albums
          .map(
            ({
              albumTitle,
              publishedAt,
              albumDescription,
              albumURL,
              remarks,
            }) =>
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
    ).join("\n\n")
  )
}

//
;(async () => {
  const lines = await getLines()
  const songs = groupBySong(lines)
  const doc = docgen(songs)

  await writeFile(path.resolve("docs", "offVocal.md"), doc)
})()
