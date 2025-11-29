---
title: "This Website"
date: 2025-11-27
description: ""
tags:
- Typescript
- Astro
- React
repo: "https://github.com/Muifrend/Portfolio-website"
---

### Project Details

This site is built with a modern, minimal stack focused on fast static output and optional interactivity.

- **Astro** — Primary framework for producing fast, SEO-friendly static pages with optional server-side rendering.
- **TypeScript** — Provides type safety across components and build scripts.
- **Tailwind CSS** — Utility-first CSS for rapid styling and responsive design (integrated via `@astrojs/tailwind`).
- **React (Islands)** — Used where interactivity is required (hydrated with Astro client directives like `client:load`).
- **Vite** — Development server and build tooling (bundling, HMR) used by Astro under the hood.
- **PostCSS + Autoprefixer** — CSS processing for Tailwind and cross-browser compatibility.
- **Astro Content Collections** (`astro:content`) — Markdown-driven content and typed collections for projects and posts.

Why these choices?

- SVGs and small assets are imported directly for simplicity and fast load times.
- Tailwind keeps CSS small and composable while enabling rapid prototyping.
- Astro's islands architecture lets us ship zero-JS pages by default and hydrate only the interactive parts.