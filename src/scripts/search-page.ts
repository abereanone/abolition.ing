import dataset from "@/data/search-index.json";
import { createSearchEngine, searchIndex } from "@/lib/search-engine.js";

const engine = createSearchEngine(Array.isArray(dataset) ? dataset : []);
let initialized = false;

export function initSearchPage() {
  if (initialized || typeof document === "undefined") {
    return;
  }
  initialized = true;

  document.addEventListener("DOMContentLoaded", () => {
    const root = document.querySelector<HTMLElement>("[data-search-root]");
    if (!root) return;

    const showQuestionIds = root.dataset.showQuestionIds === "true";
    const form = root.querySelector<HTMLFormElement>("#search-form");
    const input = root.querySelector<HTMLInputElement>("#search-input");
    const metaContainer = root.querySelector<HTMLElement>("#search-meta");
    const resultsContainer = root.querySelector<HTMLElement>("#search-results");

    if (!form || !input || !metaContainer || !resultsContainer) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q") ?? "";

    if (initialQuery) {
      input.value = initialQuery;
      performSearch(initialQuery);
    }

    let debounceTimer: number | null = null;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = input.value.trim();
      updateUrl(query);
      performSearch(query);
    });

    input.addEventListener("input", () => {
      if (debounceTimer) {
        window.clearTimeout(debounceTimer);
      }

      debounceTimer = window.setTimeout(() => {
        const query = input.value.trim();
        updateUrl(query);
        performSearch(query);
      }, 300);
    });

    function updateUrl(query: string) {
      const searchParams = new URLSearchParams(window.location.search);
      if (query) {
        searchParams.set("q", query);
      } else {
        searchParams.delete("q");
      }
      const next = `${window.location.pathname}${searchParams.toString() ? `?${searchParams}` : ""}`;
      window.history.replaceState({}, "", next);
    }

    function performSearch(query: string) {
      if (!query) {
        metaContainer.textContent = "Type a phrase to begin searching.";
        resultsContainer.innerHTML = "";
        return;
      }

      metaContainer.textContent = "Searching...";

      const payload = searchIndex(engine, query, { limit: 25 });
      const { items, total } = payload;

      if (!items.length) {
        metaContainer.textContent = `No results found for "${query}".`;
        resultsContainer.innerHTML = "";
        return;
      }

      const resultCount = total === items.length ? total : `${items.length} of ${total}`;
      metaContainer.textContent = `Showing ${resultCount} results for "${query}".`;

      resultsContainer.innerHTML = items
        .map((result) => {
          const titleHtml = result.highlightedTitle || result.title;
          const snippetHtml = result.snippet || result.excerpt || "";
          const titlePrefix =
            showQuestionIds && result.id !== null && result.id !== undefined
              ? `<span class="result-id">#${result.id}</span> `
              : "";

          return `
            <article class="search-result">
              <h2><a href="${result.url}">${titlePrefix}${titleHtml}</a></h2>
              <p class="result-snippet">${snippetHtml}</p>
            </article>
          `;
        })
        .join("");
    }
  });
}

initSearchPage();
