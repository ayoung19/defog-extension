# AGENTS.md

Guidelines for AI agents working on this codebase.

## Before Writing Code

- Read the file before editing it.
- Understand existing patterns before introducing new ones.
- Check if a shadcn component exists for what you need before building custom UI.

## Writing Code

- Prefer implicit typing. Only annotate when TypeScript can't infer.
- Never use `any` or non-null assertions (`!`). Use `as` only when external type definitions are genuinely wrong, and leave a comment explaining why.
- Don't create abstractions for things used once. Duplication is fine.
- Don't add comments, docstrings, or type annotations to code you didn't change.
- Don't add error handling for scenarios that can't happen.
- Components should own their data when possible — call hooks directly instead of receiving props from a parent.
- Import from the source file directly. No barrel/index re-export files.

## UI Components

- Always use `npx shadcn@latest add <component>` to generate UI components. Never hand-write them.
- After adding a shadcn component, remove any `<Portal>` usage — portals don't work in extension popups.
- The extension uses the Radix Lyra theme (`radix-lyra` in `components.json`).

## Testing Changes

Always run before committing:

```bash
pnpm build    # Tailwind CLI + Plasmo build
pnpm lint     # ESLint
pnpm format   # Prettier
npx tsc --noEmit  # Type check
```

Pre-commit hooks run `lint-staged` automatically, but verify the build passes separately.

## Commits

Use conventional commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`.

## Common Pitfalls

- **Tailwind CSS** is built via CLI, not PostCSS. If you add CSS that needs Tailwind processing, it goes in `popup/index.css` and gets compiled to `popup/index.built.css`.
- **`chrome.storage.local`** is the storage backend. Don't use `sync`. Each hook creates its own `Storage` instance — don't try to share one.
- **`chrome.i18n.getMessage()`** is used directly for all user-facing strings. No wrapper functions. Add new strings to `locales/en/messages.json`.
- **Service worker** (`background/`) has no DOM access. Use `data-base64:~assets/...` for asset imports.
- **`forwardRef`** is needed on custom input components for `react-hook-form` `Controller` to work on React 18.
