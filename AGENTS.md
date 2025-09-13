# Repository Guidelines

This repository is a Next.js 15 + TypeScript app styled with Tailwind CSS v4 and linted with ESLint. Keep changes small, focused, and easy to review.

## Project Structure & Module Organization

- `app/` – App Router (route segments), `layout.tsx`, `page.tsx`, global styles in `app/globals.css`.
- `components/` – Reusable UI; `components/magicui/` contains custom UI pieces. Use PascalCase for component files.
- `lib/` – Utilities (e.g., `lib/utils.ts` with `cn`). Path alias `@/*` maps to repo root.
- `public/` – Static assets served as-is.
- Config: `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `tsconfig.json`.

## Build, Test, and Development Commands

- Dev: `bun dev` (or `npm run dev`) – starts Turbopack dev server at `http://localhost:3000`.
- Build: `bun run build` – production build.
- Start: `bun start` – serve the production build.
- Lint: `bun run lint` – run ESLint (extends `next/core-web-vitals`).

## Coding Style & Naming Conventions

- TypeScript (strict), 2‑space indentation.
- Components: PascalCase (`Button.tsx`). Hooks: `useX.ts`. Route folders: kebab-case.
- Prefer functional, server-first components; mark client components with `"use client"` only when needed.
- Tailwind in `app/globals.css`; keep class lists readable and compose via `cn(...)` from `lib/utils.ts`.

## Testing Guidelines

- No test framework configured yet. If adding tests, prefer Vitest + React Testing Library.
- Name tests `*.test.ts`/`*.test.tsx` colocated with the source, and add an `npm test`/`bun test` script.

## Commit & Pull Request Guidelines

- use Conventional Commits (e.g., `feat:`, `fix:`, `chore:`).
- PRs: include a clear summary, linked issues, UI screenshots/GIFs when applicable, and rationale for notable decisions.
- Before requesting review: run lint, ensure type checks pass, and the app builds locally.

## Security & Configuration Tips

- Store secrets in `.env.local` (never commit). Expose only with `NEXT_PUBLIC_` when needed by the browser.
- Avoid importing server-only code into client components.

## Agent-Specific Notes

- Make minimal diffs; update only what you touch. Run ESLint and (if configured) Prettier on changed files. Keep changes KISS and DRY.
