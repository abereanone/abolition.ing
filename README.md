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

- `src/data/questions/` contains one or more JSON files (each exporting an array of question objects). Questions support optional `longAuthorId` and `suppressAuthor` fields; long explanations are picked up automatically when a companion Markdown file following the `slug-long.md` convention exists.
- `src/config/siteSettings.ts` centralizes global display toggles (e.g., `showQuestionId`, `showAuthor`, `enablePagination`, `questionsPerPage`). Setting `showAuthor` to `false` hides author/byline UI everywhere; when `true`, per-question `suppressAuthor` still applies. Disable pagination or adjust page size here as needed.
- `src/data/categories.json` provides canonical category labels.
- `src/data/resources.json` stores author/resource metadata (name, slug, external url, optional title/bio).
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

1. Add or update question metadata in a JSON file under `src/data/questions/` (set `published: true` and optional `suppressAuthor`, `longAuthorId`). Include an `id` value if you want it surfaced when `showQuestionId` is enabled-the list order also follows ascending `id` (falling back to title sorting when omitted). If you need a long-form answer, create a Markdown file named `{slug}-long.md` (or `{markdownFileName}-long.md`) alongside the main answer and it will be detected automatically. Pagination automatically slices lists according to `questionsPerPage`.
2. Create the associated Markdown file under `src/content/questions/`.
3. Define any new categories in `src/data/categories.json`. The helper library automatically slugifies category names and counts question usage.
4. Add or update author entries in `src/data/resources.json`, then reference by `authorId` inside questions.
5. Category pages are generated at `/categories/{slug}` (index at `/categories/`); author/resource pages live at `/authors/{slug}` and feed the `/resources` listing.

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


