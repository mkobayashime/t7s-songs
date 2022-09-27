import type { OffVocalItem } from "../../types/offVocal"

import json from "./offVocal.json" assert { type: "json" }

const offVocals: OffVocalItem[] = json.value

export { offVocals }
