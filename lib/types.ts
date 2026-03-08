import { z } from "zod";

// --- Schemas ---

export const mappingSchema = z.object({
  id: z.string(),
  pattern: z.string(),
  label: z.string(),
});

// --- Types ---

export type Mapping = z.infer<typeof mappingSchema>;

// --- Storage keys ---

export const MAPPINGS_KEY = "mappings";
export const ENABLED_KEY = "enabled";
export const THEME_KEY = "theme";

// --- Safe parsing ---

export function parseMappings(raw: unknown): Mapping[] {
  const result = z.array(mappingSchema).safeParse(raw);
  if (!result.success) return [];
  return result.data;
}
