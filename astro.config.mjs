// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

import icon from 'astro-icon';

import { loadEnv } from 'vite';

const isLocalDevelopment = process.argv.includes('dev');

// Astro/Vite normally exposes `.env` values through `import.meta.env`. This demo's
// server boundary deliberately reads the OpenAI secret from Node's private
// environment instead, so load only that one value into `process.env` for dev.
if (isLocalDevelopment && !process.env.OPENAI_API_KEY) {
  const localOpenAIKey = loadEnv('development', process.cwd(), '').OPENAI_API_KEY;
  if (localOpenAIKey) process.env.OPENAI_API_KEY = localOpenAIKey;
}

// https://astro.build/config
export default defineConfig({
  integrations: [react(), icon()],
  // POST endpoints need on-demand rendering. Keep the deployed build static; the
  // portrait endpoint exists only while running `npm run dev`.
  output: isLocalDevelopment ? 'server' : 'static',
  site: 'https://Muifrend.github.io',
  vite: {
    plugins: [tailwindcss()]
  }
});
