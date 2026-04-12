# Repository Guidelines

## Project Structure & Module Organization
This repo is a Next.js 14 app-router project. Route files live in `app/`, shared UI lives in `app/(components)`, and API handlers live under `app/api/**/route.js`. Business logic is split into `domain/` for shared types and models, `interactors/` for use cases, and `repositories/` for MongoDB access and migrations. Static assets belong in `public/`. Utility scripts are in `app/utils/` and `utils/`; the latter also contains Python recommendation-model code.

Use the configured path aliases instead of deep relative imports when possible, for example `@/app/layout`, `@components/Nav`, or `@repositories/UserRepository`.

## Build, Test, and Development Commands
- `npm run dev`: start the local Next.js dev server.
- `npm run build`: create a production build and catch route/runtime build errors.
- `npm run start`: serve the production build locally.
- `npm run lint`: run the Next.js ESLint config.
- `npm run increment-version`: update `app/utils/version.js`; this also runs automatically on `pre-push`.

If you use the container workflow, open the repo with `.devcontainer/devcontainer.json`.

## Coding Style & Naming Conventions
Prettier is the formatting baseline: 2-space indentation, semicolons, single quotes, trailing commas where valid, and `LF` line endings. Run formatting before opening a PR if your editor does not do it automatically. ESLint extends `next/core-web-vitals`.

Follow existing naming patterns: React components use `PascalCase.jsx`, route segments use kebab-case folder names, and interactor/repository classes use descriptive `PascalCase.ts` names such as `ReadPublicBookshelfInteractor.ts`.

## Testing Guidelines
There is no first-party automated test suite or `npm test` script yet. For now, every change should pass `npm run lint`, `npm run build` for risky changes, and manual verification of the affected page or API route. When adding tests later, keep them outside `node_modules/` and name them `*.test.*` or `*.spec.*`.

## Commit & Pull Request Guidelines
Recent history favors short, direct commit subjects such as `share link fix` and `fix for creating user`. Prefer a concise imperative summary, keep unrelated changes out of the same commit, and avoid noisy merge commits on feature branches.

PRs should explain user-visible changes, list validation steps, link the related issue when available, and include screenshots for UI updates.
