import { songs } from "."

it("has unique song slugs", () => {
  const uniqueSlugs = Array.from(new Set(songs.map(({ slug }) => slug)))

  expect(songs.length).toBe(uniqueSlugs.length)
})

it("has unique official ids", () => {
  const uniqueIds = Array.from(
    new Set(songs.map(({ officialId }) => officialId)),
  )

  expect(songs.length).toBe(uniqueIds.length)
})
