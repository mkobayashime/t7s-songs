import fs from "node:fs/promises"
import path from "node:path"
import rl, { Interface as ReadlineInterface } from "node:readline"

import songs from "../data/songs/songs.json" assert { type: "json" }
import type { Song } from "../types"

const readKeyboardInput = async (
  readline: ReadlineInterface,
  prompt: string,
): Promise<string> =>
  new Promise((resolve) => {
    readline.question(prompt, (str) => resolve(str))
  })

//
;(async () => {
  const readline = rl.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const slug = await readKeyboardInput(readline, "Slug: ")
  const title = await readKeyboardInput(readline, "Title: ")
  const officialId =
    parseInt(await readKeyboardInput(readline, "Official ID: ")) || null
  const publishedAt = await readKeyboardInput(readline, "Published at: ")
  const description = await readKeyboardInput(readline, "Description: ")
  const image = await readKeyboardInput(readline, "Image URL: ")

  readline.close()

  const songAttributes: Song = {
    slug,
    title,
    officialId,
    publishedAt,
    description,
    image,
  }

  const songsWithNewOne = {
    ...songs,
    value: [...songs.value, songAttributes],
  }

  await fs.writeFile(
    path.resolve("data", "songs", "songs.json"),
    JSON.stringify(songsWithNewOne),
  )
})().catch((err) => console.error(err))
