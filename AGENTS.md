# Repository Guidelines

This repo is a Next.js 15 + TypeScript app styled with Tailwind CSS v4 and linted with ESLint. Keep changes small, focused, and easy to review.

## Project Structure & Module Organization

- `app/` — App Router route segments, `layout.tsx`, `page.tsx`, global styles in `app/globals.css`.
- `components/` — Reusable UI; `components/magicui/` holds Magic UI pieces; `components/magicui/` holds custom UI pieces. Files use PascalCase.
- `lib/` — Utilities (e.g., `lib/utils.ts` with `cn`). Path alias `@/*` maps to repo root.
- `public/` — Static assets.
- Config: `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `tsconfig.json`.

## Build, Test, and Development Commands

- Dev: `bun dev` (or `npm run dev`) — starts Turbopack at http://localhost:3000.
- Build: `bun run build` — production build.
- Start: `bun start` — serve production build.
- Lint: `bun run lint` — ESLint (extends `next/core-web-vitals`).

## Coding Style & Naming Conventions

- TypeScript (strict), 2‑space indentation.
- Components: PascalCase (`Button.tsx`). Hooks: `useX.ts`. Route folders: kebab-case.
- Prefer server-first components; add `"use client"` only when necessary.
- Tailwind lives in `app/globals.css`. Keep class lists readable; compose via `cn(...)` from `lib/utils.ts`.
- Format with Prettier 3 (installed). Example: `bunx prettier --write path/to/file`.

## Commit & Pull Request Guidelines

- Use Conventional Commits (e.g., `feat:`, `fix:`, `chore:`).
- PRs include: clear summary, linked issues, screenshots/GIFs for UI, and rationale for notable choices.
- Before review: run lint, ensure type checks pass, and confirm the app builds locally.

## Security & Configuration Tips

- Secrets live in `.env.local` (never commit). Only expose via `NEXT_PUBLIC_` when required in the browser.
- Do not import server-only code into client components.

## Agent-Specific Notes

- Make minimal diffs. Touch only what you change. Run ESLint and Prettier on edited files. Keep things KISS and DRY.
- NEVER ignore es-lint; NEVER use the 'any' type and try to avoid 'unknown' type.
- Do NOT use magic strings, use enums or constants instead if possible.

## UI

- we're using shadcn components as well as Magic UI and 21st.dev. Always read relevant docs using context7 when working with any of these libraries. Always follow best practices when using them.
- Always design everything so it's responsive and works on all screen sizes, as well as mobile, tablet, and desktop. make sure it looks great on all screen sizes and devices and also works great on all.
- use lucide.dev icons for everything, never custom code icons unless instructed.
- Always design for both dark and light theme so that everything always looks good in both themes.
