import { songs, songsMap } from "."
import * as Map from "fp-ts/Map"

it("has unique song slugs", () => {
  const uniqueSlugs = Array.from(new Set(songs.map(({ slug }) => slug)))

  expect(Map.size(songsMap)).toBe(uniqueSlugs.length)
})

it("has unique official ids", () => {
  const uniqueIds = Array.from(
    new Set(songs.map(({ officialId }) => officialId)),
  )

  expect(Map.size(songsMap)).toBe(uniqueIds.length)
})
