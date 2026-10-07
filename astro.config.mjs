import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import redirects from './src/data/redirects.json';

const redirectConfig = Object.fromEntries(
  redirects.map(({ source, destination }) => [source, destination]),
);

export default defineConfig({
  site: 'https://www.alokthakur.me',
  redirects: redirectConfig,
  integrations: [
    mdx(),
  ],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
});
