import { songs } from "./songs"

it("has unique song slugs", () => {
  const slugs = songs.map(({ slug }) => slug)
  const uniqueSlugs = Array.from(new Set(slugs))

  expect(songs.length).toBe(uniqueSlugs.length)
})

it("has unique official ids", () => {
  const ids = songs.map(({ officialId }) => officialId)
  const uniqueIds = Array.from(new Set(ids))

  expect(ids.length).toBe(uniqueIds.length)
})
