# Repository Guidelines

This project is a small “web OS” built with Next.js 15 + TypeScript, styled with Tailwind CSS v4, and deployed to Cloudflare Workers via OpenNext. Keep diffs minimal and focused.

## Project Structure & Modules

- `app/` — App Router; global styles in `app/globals.css`; terminal → Desktop flow in `app/page.tsx`.
- `components/os/` — Desktop, `AppWindow` (drag/resize), Dock, `StatusBar`, app windows (Files, Calculator, Notes).
- `components/magicui/` — Magic UI widgets (`morphing-text`, terminal).
- `components/ui/` — Primitives (`badge`, `button`, `calendar`, `sliding-number`, `noise`).
- `lib/utils.ts` — `cn` helper. Path alias `@/*` maps to repo root.
- Config: `next.config.ts`, `open-next.config.ts`, `wrangler.jsonc`, `biome.json`, `postcss.config.mjs`, `tsconfig.json`.

## Dev, Build, Deploy

- Dev: `bun dev` — Next dev with Cloudflare compat (`initOpenNextCloudflareForDev`).
- Lint: `bun run lint`.
- Preview (Workers): `bun run preview`.
- Deploy (Workers): `bun run deploy` (OpenNext build + publish). Assets upload: `bun run upload`. Typegen: `bun run cf-typegen`.

## Architecture Notes

- Boot sequence: terminal runs and prompts for name; then Desktop mounts. Background noise + `MorphingText` show a time‑aware greeting (“good morning/evening {name}”).
- Windows: draggable/resizable; last interaction brings to front; Dock clicks also refocus existing windows.
- Status bar: animated HH:MM:SS via `SlidingNumber`; clicking the date opens a view‑only `Calendar`, with fullscreen and power controls.

## Style & Conventions

- TypeScript (strict), 2‑space indent. Components PascalCase; hooks `useX.ts`; route folders kebab‑case.
- Prefer server‑first; add "use client" only when needed. Keep Tailwind class lists readable; compose via `cn(...)`.
- Format only touched files with Biome.

## Testing

- None configured. If adding, use Vitest + React Testing Library; colocate `*.test.ts(x)` and add a `test` script.

## Security & Cloudflare

- Secrets in `.env.local` (never commit). Only expose `NEXT_PUBLIC_` to the client.
- Worker entry: `.open-next/worker.js`. Optional ISR cache via R2 (`wrangler.jsonc`: `NEXT_INC_CACHE_R2_BUCKET`).

## Agent-Specific Notes

- Make minimal diffs. Touch only what you change. Run Biome checks on edited files. Keep things KISS and DRY.
- NEVER ignore lint issues; NEVER use the 'any' type and try to avoid 'unknown' type.
- Do NOT use magic strings, use enums or constants instead if possible.

## UI

- we're using shadcn components as well as Magic UI and 21st.dev. Always read relevant docs using context7 when working with any of these libraries. Always follow best practices when using them.
- Always design everything so it's responsive and works on all screen sizes, as well as mobile, tablet, and desktop. make sure it looks great on all screen sizes and devices and also works great on all.
- use lucide.dev icons for everything, never custom code icons unless instructed.
- Always design for both dark and light theme so that everything always looks good in both themes.
