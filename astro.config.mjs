// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// GitHub Pages *User Site*: the repository must be named `suygohri-lab.github.io`
// and the site is served from the domain root, so no `base` path is needed.
// (For a project site you would instead set `base: "/<repo-name>"`.)
export default defineConfig({
  site: "https://suygohri-lab.github.io",
  base: "/",
  trailingSlash: "ignore",
  integrations: [sitemap()],
  // Content-Security-Policy friendly output (see the CSP <meta> in BaseLayout): every script and
  // stylesheet is a separate file, never inlined into the page, so script-src/style-src 'self' work.
  build: {
    inlineStylesheets: "never",
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      assetsInlineLimit: 0,
    },
  },
});
