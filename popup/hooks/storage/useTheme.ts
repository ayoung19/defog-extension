import { Storage } from "@plasmohq/storage";
import { useStorage } from "@plasmohq/storage/hook";

import { THEME_KEY } from "@/types/storage";

export type Theme = "system" | "light" | "dark";

export function useTheme() {
  return useStorage<Theme>(
    { key: THEME_KEY, instance: new Storage({ area: "local" }) },
    (v) => (v === undefined ? "system" : v),
  );
}
