/** @type {import('jest').Config} */
const config = {
  transform: {
    "^.+\\.tsx?$": "@swc/jest",
  },
}

export default config
