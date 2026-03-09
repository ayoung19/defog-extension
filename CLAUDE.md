# CLAUDE.md

## Project

Defog is a browser extension that replaces text patterns with human-readable labels across all webpages. Built with Plasmo, React 18, Tailwind CSS v4, and shadcn/ui (Radix Lyra theme).

## Commands

```bash
pnpm dev              # Start dev server (Plasmo + Tailwind CSS watcher)
pnpm build            # Production build (Chrome)
pnpm build:firefox    # Production build (Firefox)
pnpm lint             # ESLint with auto-fix
pnpm format           # Prettier with auto-fix
pnpm generate:translations  # Generate i18n translations via DeepL (requires .env.local with DEEPL_API_KEY)
```

## Architecture

- `types/` — Shared types, zod schemas, storage keys. Imported by both popup and content script.
- `popup/` — React UI. Components, hooks, dialogs.
- `contents/` — Plasmo content scripts. DOM replacement logic. No React.
- `background/` — Service worker. Icon state on startup/install.
- `locales/` — Chrome i18n messages. English source in `locales/en/messages.json`.
- `locale-overrides/` — Manual translation corrections applied during generation.

Content scripts and popup share types through `types/`. Content scripts must never import from `popup/`. Popup must never import from `contents/`.

## Plasmo / Extension Quirks

- **Tailwind CSS v4 uses the CLI**, not PostCSS. Parcel (Plasmo's bundler) can't resolve `@tailwindcss/postcss` due to `node:module` imports. The Tailwind CLI builds `popup/index.css` → `popup/index.built.css`, which the popup imports.
- **No portals in extension popups.** Radix portals render outside the popup's tiny viewport. Remove `<Portal>` from any shadcn component that uses one (Select, Dialog overlay is fine since it's fullscreen).
- **Service worker assets** use `data-base64:~assets/filename.png` imports since file paths aren't available in service workers.
- **Storage** uses `chrome.storage.local` (not sync — mappings can be large). Each React hook creates its own `new Storage({ area: "local" })` instance.
- **i18n** uses `chrome.i18n.getMessage("key")` directly. No wrapper functions.

## Code Style

- **Implicit typing.** Let TypeScript infer. No `any`, no `!`. Avoid `as` unless dealing with genuinely stale type definitions (document why).
- **No unnecessary abstractions.** If something is used once, inline it. Three similar lines are better than a premature helper. No barrel/index files.
- **Components own their data.** If a component can call a hook directly, it should. Don't prop-drill state that the component can fetch itself.
- **Use shadcn CLI** to generate UI components (`npx shadcn@latest add <component>`). Don't hand-write them.
- **Separation of concerns.** Shared non-React code lives in `types/`. Popup-only code stays in `popup/`. Content script logic stays in `contents/`.
- **Dialogs do one thing.** No multi-mode dialogs. One dialog, one purpose (create or edit, not both).
- **Primary action stays inline**, secondary actions go in dialogs.
- **Format and lint locally with auto-fix** (`--write` / `--fix`). CI checks without fixing (`--check` / no `--fix`).
- **Conventional commits.** `feat:`, `fix:`, `docs:`, `chore:`, etc.

## Adding a shadcn Component

```bash
# Always use the CLI, skip overwrites for existing files
yes "n" | npx shadcn@latest add <component> --cwd /path/to/project
```

After adding, check for `<Portal>` usage and remove it — portals break in extension popups.

## Adding an i18n String

1. Add the key to `locales/en/messages.json` with `message` and `description`.
2. Use `chrome.i18n.getMessage("keyName")` in the component.
3. Run `pnpm generate:translations` to generate all locale files.
4. To fix a bad translation, add an override in `locale-overrides/{lang}/messages.json`.
