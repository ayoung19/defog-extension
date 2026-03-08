import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { MAPPINGS_KEY, parseMappings, type Mapping } from "@/lib/types"

export function useMappings() {
  const [raw, setRaw] = useStorage<Mapping[]>(
    { key: MAPPINGS_KEY, instance: new Storage({ area: "local" }) },
    (v) => (v === undefined ? [] : v)
  )
  return [parseMappings(raw), setRaw] as const
}
