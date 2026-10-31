<div align="center">

# crossmart-web

The web app for **[Crossmart](https://github.com/crossmart-io/crossmart)**, the open-source multichannel platform for sellers and their AI agents.

</div>

> [!WARNING]
> Crossmart is in early development and not ready for production use yet.

## Stack

React 19 · Vite · TypeScript · Tailwind CSS · [shadcn/ui](https://ui.shadcn.com) · TanStack Query · React Router.
API types are generated from the backend's OpenAPI spec, so the app never hand-writes request or response types.

## Quick start

Requirements: Node.js 22+ (see `.nvmrc`), pnpm 10, and a running [Crossmart API](https://github.com/crossmart-io/crossmart#quick-start-development).

```bash
pnpm install
cp .env.example .env.local   # VITE_API_URL points at the API
pnpm dev                     # http://localhost:5173
```

## Project structure

```
src/
├── api/          # generated OpenAPI types + typed fetch/query client
├── app/          # providers, router, query client
├── components/
│   ├── layout/   # app shell, header, navigation
│   └── ui/       # shadcn/ui primitives (generated, do not edit by hand)
├── config/       # env, routes and other constants
├── features/     # one folder per feature: components, hooks, enums, tests
├── lib/          # shared utilities
└── pages/        # route-level components that compose features
```

## Regenerating the API client

When the backend API changes, regenerate the types from its `openapi.json`:

```bash
pnpm api:generate                                  # reads ../crossmart/openapi.json
OPENAPI_SPEC=path/to/openapi.json pnpm api:generate
```

## Scripts

| Script                      | Purpose                   |
| --------------------------- | ------------------------- |
| `pnpm dev`                  | Development server        |
| `pnpm build`                | Typecheck and build       |
| `pnpm lint` / `pnpm format` | oxlint and Prettier       |
| `pnpm test`                 | Unit and component tests  |
| `pnpm api:generate`         | Regenerate the API client |

## Contributing

Please read the main project's [CONTRIBUTING.md](https://github.com/crossmart-io/crossmart/blob/main/CONTRIBUTING.md). The same code standards, commit format and CLA apply here. Frontend specifics:

- Keep components small and reusable. Pages compose features, and features compose `components/ui` primitives.
- Server state lives in TanStack Query through the generated client, never in ad-hoc `fetch` calls.
- No magic strings: use enums and constants (`ROUTES.home`, `SystemStatus.Operational`).

## License

[GNU Affero General Public License v3.0](LICENSE).
