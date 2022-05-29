import { offVocals } from "."
import { songsMap } from "../songs"
import * as Map from "fp-ts/Map"
import * as string from "fp-ts/string"
import { pipe } from "fp-ts/function"

it("has valid song slugs", () => {
  offVocals.forEach(({ slug }) => {
    expect(pipe(songsMap, Map.member(string.Eq)(slug))).toBe(true)
  })
})

it("doesn't have unneeded '発売'", () => {
  offVocals.forEach(({ album: { publishedAt } }) => {
    expect(publishedAt.includes("発売")).toBeFalsy()
  })
})
