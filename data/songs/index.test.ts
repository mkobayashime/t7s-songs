import { songs } from "."

it("has unique song slugs", () => {
  const uniqueSlugs = Array.from(new Set(songs.map(({ slug }) => slug)))

  expect(songs.length).toBe(uniqueSlugs.length)
})

it("has unique official ids", () => {
  const uniqueIds = Array.from(
    new Set(
      songs
        .filter((song) => song.officialId !== null)
        .map(({ officialId }) => officialId),
    ),
  )

  expect(songs.filter((song) => song.officialId !== null).length).toBe(
    uniqueIds.length,
  )
})
