# personal_website

A small personal website built with Astro, TypeScript and Tailwind CSS. It uses React for interactive islands (navigation, galleries), Radix UI primitives, and an Embla-powered horizontal gallery for visual content.

**This README** covers: quick start, project structure, key technologies, and common troubleshooting notes.

## Quick start

Install dependencies and run the dev server:

```bash
npm install
npm run dev
# open http://localhost:4321
```

Build for production and preview the build:

```bash
npm run build
npm run preview
```

## Scripts

- `dev` — Runs the Astro dev server with HMR.
- `build` — Produces a production build in `dist/`.
- `check` — Runs Astro's type and content diagnostics.
- `check:seo` — Builds the site and validates metadata, canonical URLs, sitemap coverage, crawl rules, social previews, and gallery image assets. Deployment runs the same output checks.
- `preview` — Serves the production build locally.

## Layout and navigation

`src/layouts/Layout.astro` owns the shared container for page content and copyright. Pages use its default wide layout; project details use `contentWidth="reading"` for a centered reading column. Keep horizontal page gutters in this shared layout rather than adding nested containers.

`src/config/features.ts` controls optional navigation items. `feelingLucky` defaults to `false`, hiding Lucky on both desktop and mobile while keeping the stub page available by URL. Desktop navigation supports H for Home, P for Projects, and B for Blog; enabling Lucky also enables L. Shortcuts are disabled on mobile and while typing or using modifier keys.

Projects and Blog share `src/components/content/FilterableList.tsx` for their date/name list and tag filtering. Blog entries live in `src/content/blog` as JSON with `title`, `date` (YYYY-MM or YYYY-MM-DD), `topics`, and an HTTPS `url`. Selecting an article opens its external URL directly. Topics filters follow the same desktop-only visibility as Technologies on Projects.

## Tech stack

- Astro (framework) — static-first pages + optional SSR/islands
- TypeScript — typed components and scripts
- Tailwind CSS — utility-first styling (global utilities live in `src/styles/global.css`)
- React — hydrated components (client directives like `client:load`)
- Embla Carousel — used for the gallery feature (`src/features/gallery`)
- Astro Content Collections (`src/content/projects`) — typed Markdown project content

## Project layout (important files)

- `astro.config.mjs` — Astro configuration and integrations
- `src/layouts/Layout.astro` — site layout (navigation, main, footer)
- `src/components/site/*` — shared site chrome such as navigation and footer
- `src/features/*` — feature-level UI and behavior for home, gallery, globe, and projects
- `src/data/galleryPhotos.ts` — shared gallery/globe photo metadata
- `src/lib/*` — small framework-agnostic utilities
- `src/pages/*` — site pages (index, projects, feeling-lucky, etc.)
- `src/styles/global.css` — Tailwind entry + centralized utility classes (e.g. `.site-container`, `.form-control`) 
- `src/content/projects/*` — Markdown project entries
- `public/concepts/*` — static public text files served directly, not Astro-rendered content

## Notes & tips

- Gallery photos are optimized at build time with Astro's built-in `getImage` API. React receives responsive image URLs, dimensions, and small blurred-background placeholders; globe popovers reuse the optimized images.
- If you added `@astrojs/tailwind` in `astro.config.mjs`, install it and the PostCSS adapter used (`@tailwindcss/postcss`) to avoid runtime errors.
- Interactive React components must be hydrated with client directives (`client:load`, `client:idle`, `client:visible`). Check browser console for runtime errors if interactivity isn't working.

## SEO foundation

The canonical origin is `https://andrzejfirek.me`, configured in `astro.config.mjs` and used for both local and deployment builds. HTML page links use trailing slashes. `@astrojs/sitemap` publishes `/sitemap-index.xml` and its child sitemap, covering the homepage, project pages, and blog index. `/robots.txt` allows public crawling and points to the sitemap. The Lucky placeholder and standalone Ghost PM pitch are `noindex, follow`; the concepts collection stays unchanged and outside the portfolio sitemap.

`Layout.astro` requires a `description` alongside the page `title`. It generates canonical, Open Graph, and Twitter metadata. Optional inputs are `image` (an imported image or URL), `imageAlt`, `noindex`, and `structuredData` (a JSON-LD object or array). Project summaries provide descriptions, with a factual title/technology fallback for empty summaries. Project covers provide social images; other pages use `public/social-card.png`.

The editable default social-card source is `src/assets/social-card.svg`. After editing it, regenerate the PNG:

```bash
node --input-type=module -e 'import sharp from "sharp"; await sharp("src/assets/social-card.svg").png().toFile("public/social-card.png");'
```

### Domain and search-account follow-up

GitHub Pages already has the custom domain `andrzejfirek.me` and HTTPS enabled. The Namecheap CNAME with host `www` must target `Muifrend.github.io` (TTL: Automatic); this DNS correction was applied and verified during implementation. Preserve the apex records and the separate website at `Muifrend.github.io`. HTTP requests to `www` correctly redirect to the portfolio. The first HTTPS check after the DNS correction still reported a certificate mismatch, and GitHub's approved certificate listed only the apex domain. The same custom domain was re-saved to prompt DNS revalidation. Once the GitHub certificate updates, verify that `https://www.andrzejfirek.me/` redirects to `https://andrzejfirek.me/` with valid HTTPS. GitHub documents this setup at <https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site>.

After deployment, verify ownership in Google Search Console and Bing Webmaster Tools, submit `https://andrzejfirek.me/sitemap-index.xml`, and inspect the homepage plus a project URL. DNS ownership verification and these submissions require the corresponding account access. No analytics service is installed.

### Stage 2: after the content refresh

The current implementation deliberately leaves the visible bio and project bodies unchanged. After updating them:

- Connect Andrzej Firek and Andrew in a visible introduction, establish current AI-engineering positioning, and link representative projects.
- Finalize unique page and project descriptions from the updated material.
- Add verified `ProfilePage`/`Person` data and project `CreativeWork` records through the shared layout's JSON-LD input.
- Generate a root `/llms.txt` from the current profile, projects, writing, résumé, and contact information. Leave `/concepts/llms.txt` unchanged and outside the portfolio file.
- Generate Markdown counterparts at `/index.md`, `/projects/index.md`, `/projects/<slug>/index.md`, and `/blog/index.md`, with absolute links and without presentation embeds. Expose alternate-format links in HTML and link the Markdown versions from `/llms.txt`; exclude them from the sitemap.
- Keep Medium articles external and add original short summaries to the blog listing.
- Check all agent-facing links and verify that an agent can find the correct background, projects, and contact details from `/llms.txt` alone.

The root `/llms.txt` and Markdown counterparts are not published in stage 1, so agent-facing summaries can be based on the refreshed content. The llms.txt proposal is documented at <https://llmstxt.org/>; Google does not use it as a search-ranking signal.

## Contributing

1. Create a branch from `master`.
2. Make small, focused changes and include a short commit message.
3. Open a pull request describing purpose and behavior.

## Contact

If you want changes or need help running the project, open an issue or email `andrzej.firek@uni.minerva.edu`.

---
Generated and maintained for local development.
