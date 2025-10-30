# abolition.ing

Static Astro site for abolition.ing, publishing questions, resources, and category-driven articles around a pro-life apologetics theme.

## Stack

- [Astro](https://astro.build/) 5.x
- TypeScript-enabled project configuration (`tsconfig.json`)
- Static assets in `public/`
- Content stored as JSON and Markdown within `src/`

## Project Structure

```
.
├── public/                      # Static assets served as-is
│   └── styles/theme.css         # Shared theme styles
├── src/
│   ├── components/              # Reusable UI pieces (Navbar, QuestionFeed, etc.)
│   ├── layouts/                 # `Main.astro` site-wide layout shell
│   ├── pages/                   # Astro routes (index, categories, authors, question detail, resources)
│   ├── content/questions/       # Markdown bodies for individual questions
│   └── data/                    # JSON data sources (questions, categories, authors, resources)
├── package.json
└── astro.config.mjs
```

Key data files:

- `src/data/questions.json` describes each question (title, slug, categories, authorId, markdown filename).
- `src/data/categories.json` provides canonical category labels.
- `src/data/authors.json` stores author metadata (name, slug, external url, optional title/bio).
- `src/lib/questions.ts` centralizes helpers for slugs, published-question filtering, and category/author lookups.

## Local Development

Requirements: Node.js 18.20.8+, npm.

```bash
npm install
npm run dev
```

Astro serves the site at `http://localhost:4321/` by default. Hot module reload is enabled.

## Build & Preview

```bash
# Generate the production build
npm run build

# Preview the built site locally
npm run preview
```

Astro outputs static assets in `dist/`, suitable for static hosting or deployment via Cloudflare Workers (configuration provided in `wrangler.toml`).

## Content Workflow

1. Add or update metadata in `src/data/questions.json` (set `published: true`).
2. Create the associated Markdown file under `src/content/questions/`.
3. Define any new categories in `src/data/categories.json`. The helper library automatically slugifies category names and counts question usage.
4. Add or update author entries in `src/data/authors.json`, then reference by `authorId` inside questions.
5. Category pages are generated at `/categories/{slug}` (index at `/categories/`); author pages live at `/authors/{slug}`.

## Scripts

- `npm run dev` – local development server.
- `npm run build` – production build.
- `npm run preview` – serve the built output locally.
- `npm run astro ...` – access the Astro CLI directly (lint, check routes, etc.).

## Deployment

The repo includes `wrangler.toml` for Cloudflare Workers. Adjust per environment, then run:

```bash
npm run build
npx wrangler deploy
```

## License

MIT – see `LICENSE`.
