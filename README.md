# Defog

A browser extension that replaces text patterns (UUIDs, IDs, hashes, etc.) with human-readable labels across all webpages. Built for developers who are tired of staring at raw identifiers.

## Why

If you work with dashboards, logs, admin panels, or any interface that surfaces UUIDs and opaque IDs, you know the pain. Defog lets you define mappings like `ebbaf2eb-769b-4505-aca2-d11de10372a4` &rarr; `Andy Young` and automatically replaces them everywhere — surviving React re-renders, SPA navigation, and dynamic DOM updates.

## How It Works

- **Popup** &mdash; Add, edit, and delete pattern &rarr; label mappings. Toggle replacements on/off globally.
- **Content Script** &mdash; Walks the DOM using `TreeWalker`, replaces matching text nodes, and watches for mutations via `MutationObserver` with `requestAnimationFrame` batching.
- **Storage** &mdash; All data lives in `chrome.storage.local`. The popup and content script stay in sync via storage watchers.

## Project Structure

```
defog-extension
├── assets/             # Extension icons
├── contents/           # Plasmo content scripts
├── popup/              # Popup UI (React)
│   ├── components/     # UI components, dialogs, providers
│   ├── hooks/storage/  # Typed chrome.storage.local hooks
│   └── lib/            # Popup utilities
├── scripts/            # CI/CD scripts
└── types/              # Shared types, schemas, storage keys
```

| Directory              | Description                                                                                                                                                      |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `contents/`            | [Plasmo content scripts](https://docs.plasmo.com/framework/content-scripts). Runs on every page, handles text replacement via `TreeWalker` + `MutationObserver`. |
| `types/`               | Shared non-React code. Zod schemas, TypeScript types, storage keys. Imported by both popup and content script.                                                   |
| `popup/`               | [Plasmo popup](https://docs.plasmo.com/framework/ext-pages#adding-a-popup-page). React UI for managing mappings.                                                 |
| `popup/hooks/storage/` | Typed React hooks wrapping `chrome.storage.local`.                                                                                                               |
| `popup/components/ui/` | [shadcn/ui](https://ui.shadcn.com/) components (Radix Lyra theme).                                                                                               |
| `scripts/`             | Shell scripts used in CI workflows.                                                                                                                              |

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server (Plasmo + Tailwind CSS watcher)
pnpm dev
```

Load the extension from `build/chrome-mv3-dev` in `chrome://extensions` with developer mode enabled.

## Scripts

| Command                | Description                    |
| ---------------------- | ------------------------------ |
| `pnpm dev`             | Start development server       |
| `pnpm build`           | Production build (Chrome)      |
| `pnpm build:firefox`   | Production build (Firefox)     |
| `pnpm package`         | Package Chrome build into zip  |
| `pnpm package:firefox` | Package Firefox build into zip |
| `pnpm lint`            | ESLint (auto-fix)              |
| `pnpm format`          | Prettier (auto-fix)            |

## Contributing

Contributions are welcome. Feel free to pick up any unassigned issue or open a new one.

## Contributors

<!-- readme: contributors -start -->
<!-- readme: contributors -end -->
