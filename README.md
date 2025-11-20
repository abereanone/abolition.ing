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

### Grouped Question IDs

- To partition questions into named groups (e.g., catechisms), add a `groupCode` property to any category in `src/data/categories.json` (e.g., `"groupCode": "WSC"`). Every question tagged with that category is treated as part of the group.
- For grouped questions, ID-style URLs include the group code (`/questions/WSC8`). Prev/Next navigation, random links, and display labels stay within the active group context.
- Visiting `/questions/<id>` still works: if multiple grouped answers share the same numeric ID, that route shows a hub listing each group-specific answer so the user can choose the desired version.

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

## Spinning Up A New Q&A Site

Use this repo as a template for other projects (e.g., a catechism Q&A) by following this checklist:

1. **Copy the repo** – clone to a new folder or repo; run `npm install`.
2. **Update global branding** – edit `src/config/siteSettings.ts` (site name, description, logo path, footer copy, analytics IDs). Replace `/public/images/site-logo.svg` or adjust `logoPath`.
3. **Swap data/content** – replace JSON entries in `src/data/questions/` with your new questions. Drop matching Markdown files (`slug.md` and optional `slug-long.md`) into `src/content/questions/`. Update categories (`src/data/categories.json`) and authors/resources (`src/data/resources.json`) if needed.
4. **Adjust static text** – review `src/pages/about.astro`, `resources.astro`, `copyright.astro`, `README.md`, etc., for project-specific language.
5. **Check assets** – update favicons/site manifest, hero images, or any brand-specific images under `public/`.
6. **Verify locally** – `npm run dev` to spot-check pages, including mobile layout. Run `npm run build` to rebuild the search index/client bundle.
7. **Deploy** – configure a new Cloudflare (or other host) project, then run `npm run build && npx wrangler deploy` (or your host’s equivalent).

## Styling & Theme Notes

- Global colors/typography live in `styles/theme.css`. Modify variables or base selectors there to change the overall aesthetic.
- Component-specific styles are usually defined inside each `.astro` file’s `<style>` block. Update these blocks to tweak layout/spacing for individual components (e.g., `InlineSearchBox`, `QuestionFeed`, `Footer`).
- The navbar/footer pull brand assets from `siteSettings.branding.logoPath`. Swap that file or update the config path to change the logo across the site.
- For per-page tweaks, edit the `<style>` sections inside the relevant page templates (e.g., `src/pages/questions/[slug].astro` for question detail layout). Media queries are already present; extend them as needed for custom breakpoints.

## License

MIT – see `LICENSE`.


