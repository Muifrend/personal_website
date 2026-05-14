# personal_website

A small personal website built with Astro, TypeScript and Tailwind CSS. It uses React for interactive islands (navigation, galleries), Radix UI primitives, and an Embla-powered horizontal gallery for visual content.

**This README** covers: quick start, project structure, key technologies, and common troubleshooting notes.

## Quick start

Install dependencies and run the dev server:

```bash
npm install
npm run dev
# open http://localhost:3000
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
- `preview` — Serves the production build locally.

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

- SVGs are imported directly (they scale and typically do not need raster optimization). For photos you want responsive optimization, add the Astro image integration (`@astrojs/image`) and replace `<img>` with the integration's `Image` component.
- If you added `@astrojs/tailwind` in `astro.config.mjs`, install it and the PostCSS adapter used (`@tailwindcss/postcss`) to avoid runtime errors.
- Interactive React components must be hydrated with client directives (`client:load`, `client:idle`, `client:visible`). Check browser console for runtime errors if interactivity isn't working.

## Contributing

1. Create a branch from `master`.
2. Make small, focused changes and include a short commit message.
3. Open a pull request describing purpose and behavior.

## Contact

If you want changes or need help running the project, open an issue or email `andrzej.firek@uni.minerva.edu`.

---
Generated and maintained for local development.
