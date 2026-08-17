import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import path from "node:path";

// Pages are emitted as files (/questions/foo.html) but every canonical link on the
// site is extensionless (/questions/foo), so sitemap URLs are normalized to match.
const stripFileExtension = (rawUrl) => {
  const url = new URL(rawUrl);
  url.pathname = url.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
  if (url.pathname === "") url.pathname = "/";
  return url.href;
};

export default defineConfig({
  site: "https://abolition.ing",
  integrations: [
    sitemap({
      filter: (page) => {
        const { pathname } = new URL(stripFileExtension(page));
        // /q/* are 301 redirects to /questions/*, and /random is a client-side shuffler.
        if (pathname.startsWith("/q/") || pathname === "/random") return false;
        // /questions/41 and /questions/BIB41 are aliases; the slug route is canonical.
        if (pathname.startsWith("/questions/")) {
          const segment = pathname.slice("/questions/".length);
          if (/^[A-Z0-9]+$/.test(segment)) return false;
        }
        return true;
      },
      serialize: (item) => ({ ...item, url: stripFileExtension(item.url) }),
    }),
  ],
  build: {
    format: "file",
  },
  vite: {
    resolve: {
      alias: {
        "@": path.resolve("./src"),
      },
    },
  },
});
