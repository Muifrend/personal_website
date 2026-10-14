// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), icon(), sitemap({
    filter: (page) => {
      const { pathname } = new URL(page);
      return pathname === '/' || pathname === '/blog/' ||
        pathname === '/projects/' || /^\/projects\/[^/.]+\/$/.test(pathname);
    },
  })],
  site: 'https://andrzejfirek.me',
  trailingSlash: 'always',
  vite: {
    plugins: [tailwindcss()]
  }
});
