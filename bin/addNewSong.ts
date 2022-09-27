import fs from "node:fs/promises"
import path from "node:path"
import rl, { Interface as ReadlineInterface } from "node:readline"

import type { Song } from "../types/index"

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
  if (!officialId) {
    throw new Error("Error: OfficialId must be integer")
  }
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

  const songsJsonString = (
    await fs.readFile(path.resolve("data", "songs", "songs.json"))
  ).toString()
  const songs = JSON.parse(songsJsonString)

  const songsWithNewOne = {
    ...songs,
    value: [...songs.value, songAttributes],
  }

  await fs.writeFile(
    path.resolve("data", "songs", "songs.json"),
    JSON.stringify(songsWithNewOne),
  )
})()