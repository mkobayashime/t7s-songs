import type { Config } from "jest"

const config: Config = {
  transform: {
    "^.+\\.tsx?$": "@swc/jest",
  },
}

export default config
