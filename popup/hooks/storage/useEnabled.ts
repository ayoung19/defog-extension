import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { ENABLED_KEY } from "@/lib/types"

export function useEnabled() {
  return useStorage<boolean>(
    { key: ENABLED_KEY, instance: new Storage({ area: "local" }) },
    (v) => (v === undefined ? true : v)
  )
}
