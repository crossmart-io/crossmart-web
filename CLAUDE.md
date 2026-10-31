# Crossmart web: agent instructions

Follow the code standards in the main repo's [CONTRIBUTING.md](https://github.com/crossmart-io/crossmart/blob/main/CONTRIBUTING.md) and the frontend notes in [README.md](README.md).

- Small, reusable components with no spaghetti. Use `features/<name>/{components,hooks}` and `components/ui` (shadcn, add components with `npx shadcn@latest add <name>`).
- No magic strings: enums and `as const` constants (`ROUTES`, `env`). Read `import.meta.env` only in `src/config/env.ts`.
- API types come from `pnpm api:generate`. Never hand-write them, and never edit `src/api/schema.ts`.
- Verify with `pnpm format && pnpm lint && pnpm typecheck && pnpm test && pnpm build` (Node 22+).
- Code, comments, commits and docs are in English. Use Conventional Commits.
