<div align="center">

# crossmart-web

The web app for **[Crossmart](https://github.com/crossmart-io/crossmart)**, the open-source multichannel platform for sellers and their AI agents.

</div>

> [!WARNING]
> Crossmart is in early development and not ready for production use yet.

<!-- screenshots -->

Shopify and eBay are live. Google Shopping and Etsy are coming soon, and Amazon and Walmart are planned.

## Stack

React 19 · Vite · TypeScript · Tailwind CSS · [shadcn/ui](https://ui.shadcn.com) · TanStack Query · React Router.
API types are generated from the backend's OpenAPI spec, so the app never hand-writes request or response types.

## Quick start

Requirements: Node.js 22 (pinned in `.nvmrc`, and the version the Dockerfile and CI use), pnpm 10, and a running [Crossmart API](https://github.com/crossmart-io/crossmart#quick-start-development).

```bash
pnpm install
cp .env.example .env.local
pnpm dev                     # http://localhost:5173
```

### Environment

| Variable       | Purpose                                                                        | Default                     |
| -------------- | ------------------------------------------------------------------------------ | --------------------------- |
| `VITE_API_URL` | The Crossmart API the app talks to                                             | `http://localhost:3000`     |
| `VITE_MCP_URL` | The MCP server address shown under Settings → Connected agents, for AI clients | `http://localhost:3100/mcp` |

Both are read at build time, so changing them needs a restart of `pnpm dev` or a new build.

## Signing in

The app uses the API's session cookie (Better Auth). Open `http://localhost:5173`, create an account, and the API sets up your first workspace.

For the cookie to be accepted, the web app's origin must be listed in the API's `CORS_ORIGINS`, and the API's `WEB_APP_URL` must point at it (both default to `http://localhost:5173`). If you run the web app on another port or host, update both in the API's `.env` and restart it.

### Demo data

To get an account with products, variants and stock to click through, run `pnpm seed:demo` in the backend repo while the API is running. It creates a local demo account, fills it with data and prints the login. See the [backend README](https://github.com/crossmart-io/crossmart#demo-data).

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

The types in `src/api/schema.ts` are generated from the backend's `openapi.json`. Clone the [backend](https://github.com/crossmart-io/crossmart) next to this repo as `crossmart`:

```
work/
├── crossmart/       # backend
└── crossmart-web/   # this repo
```

When the backend API changes, produce the spec there and regenerate the types here:

```bash
# in ../crossmart
pnpm build:api && pnpm openapi:generate           # writes openapi.json

# in crossmart-web
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

## Deploy

The `Dockerfile` builds the app and serves the static bundle with nginx on port 80. The API and MCP addresses are baked in at build time through build args:

```bash
docker build \
  --build-arg VITE_API_URL=https://api.example.com \
  --build-arg VITE_MCP_URL=https://mcp.example.com/mcp \
  -t crossmart-web .
docker run -p 8080:80 crossmart-web
```

The nginx config falls back to `index.html` for client-side routes, and the Content Security Policy only allows connections to the `VITE_API_URL` origin. Add the app's public URL to the API's `CORS_ORIGINS` and set it as `WEB_APP_URL`.

## Contributing

Please read the main project's [CONTRIBUTING.md](https://github.com/crossmart-io/crossmart/blob/main/CONTRIBUTING.md). The same code standards, commit format and CLA apply here. Frontend specifics:

- Keep components small and reusable. Pages compose features, and features compose `components/ui` primitives.
- Server state lives in TanStack Query through the generated client, never in ad-hoc `fetch` calls.
- No magic strings: use enums and constants (`ROUTES.home`, `SystemStatus.Operational`).

## Getting help

- Questions and chat: join the community on [Discord](https://discord.gg/dWPQjnzWhf).
- Ideas and longer threads: [GitHub Discussions](https://github.com/crossmart-io/crossmart/discussions).
- Bugs in the web app: [open an issue](https://github.com/crossmart-io/crossmart-web/issues/new/choose) here.
- Security issues: never in public. See [SECURITY.md](SECURITY.md).

## License

Copyright (C) 2026 YIOT LLC.

crossmart-web is licensed under the [GNU Affero General Public License v3.0 only](LICENSE) (`AGPL-3.0-only`).
"Crossmart" and the Crossmart logo are trademarks of YIOT LLC and are not covered by the code license.

Channel logos (Shopify, eBay, Google, Etsy and others) are trademarks of their respective owners. They are used only to identify the sales channels Crossmart connects to and do not imply endorsement. Amazon and Walmart are shown as neutral monograms.
