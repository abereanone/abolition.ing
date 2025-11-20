import dataset from "@/data/search-index.json";
import { createSearchEngine, searchIndex } from "@/lib/search-engine.js";

const engine = createSearchEngine(Array.isArray(dataset) ? dataset : []);
let initialized = false;
const MIN_QUERY_LENGTH = 3;

export function initSearchPage() {
  if (initialized || typeof document === "undefined") {
    return;
  }
  initialized = true;

  const start = () => {
    const root = document.querySelector<HTMLElement>("[data-search-root]");
    if (!root) return;

    const showQuestionIds = root.dataset.showQuestionIds === "true";
    const form = root.querySelector<HTMLFormElement>("#search-form");
    const input = root.querySelector<HTMLInputElement>("#search-input");
    const metaContainer = root.querySelector<HTMLElement>("#search-meta");
    const resultsContainer = root.querySelector<HTMLElement>("#search-results");
    const authorFilter = root.querySelector<HTMLElement>("[data-author-filter]");

    if (!form || !input || !metaContainer || !resultsContainer) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q") ?? "";
    let selectedAuthor = params.get("author") || "";
    const authorMapRaw = root.dataset.authorMap;
    const authorLookup: Record<string, string> = {};
    if (authorMapRaw) {
      try {
        const parsed = JSON.parse(authorMapRaw);
        if (Array.isArray(parsed)) {
          parsed.forEach((entry) => {
            if (entry && typeof entry.id === "string") {
              authorLookup[entry.id] = entry.name ?? entry.id;
            }
          });
        }
      } catch (error) {
        console.warn("Unable to parse author map for search filters.", error);
      }
    }

    if (initialQuery) {
      input.value = initialQuery;
      performSearch(initialQuery);
    }

    focusSearchInput();

    let debounceTimer: number | null = null;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = input.value.trim();
      const normalized = normalizeQueryValue(query);
      updateUrlState(normalized);
      performSearch(normalized);
    });

    input.addEventListener("input", () => {
      if (debounceTimer) {
        window.clearTimeout(debounceTimer);
      }

      debounceTimer = window.setTimeout(() => {
        const query = input.value.trim();
        const normalized = normalizeQueryValue(query);
        updateUrlState(normalized);
        performSearch(normalized);
      }, 300);
    });

    if (authorFilter) {
      authorFilter.addEventListener("click", (event) => {
        const target = event.target as HTMLButtonElement | null;
        if (!target || !target.closest("[data-author]")) {
          return;
        }
        const authorId = target.dataset.author ?? "";
        if (authorId === selectedAuthor) {
          selectedAuthor = "";
        } else {
          selectedAuthor = authorId;
        }
        updateAuthorButtons(authorFilter, selectedAuthor);
        applyUrlState(input.value.trim(), selectedAuthor);
        performSearch(input.value.trim());
      });

      updateAuthorButtons(authorFilter, selectedAuthor);
      if (selectedAuthor && !initialQuery) {
        performSearch("");
      }
    }

    function updateUrlState(query: string) {
      applyUrlState(query, selectedAuthor);
    }

    function focusSearchInput() {
      if (typeof input.focus === "function") {
        requestAnimationFrame(() => {
          input.focus({ preventScroll: true });
        });
      }
    }

    function performSearch(query: string) {
      const normalizedQuery = normalizeQueryValue(query);
      const hasQuery = Boolean(normalizedQuery);
      const hasAuthor = Boolean(selectedAuthor);

      if (!hasQuery && !hasAuthor) {
        metaContainer.textContent = "Type a phrase or select an author to begin searching.";
        resultsContainer.innerHTML = "";
        return;
      }

      if (hasQuery && normalizedQuery.length < MIN_QUERY_LENGTH) {
        metaContainer.textContent = "Please enter at least 3 characters to search.";
        resultsContainer.innerHTML = "";
        return;
      }

      metaContainer.textContent = "Searching...";

      const payload = searchIndex(engine, normalizedQuery, {
        limit: 25,
        authors: selectedAuthor ? [selectedAuthor] : undefined,
      });
      const { items, total } = payload;

      const authorName = selectedAuthor ? authorLookup[selectedAuthor] ?? selectedAuthor : null;
      const filterLabel = buildFilterLabel(hasQuery ? normalizedQuery : "", authorName);

      if (!items.length) {
        metaContainer.textContent = filterLabel ? `No results found for ${filterLabel}.` : "No results found.";
        resultsContainer.innerHTML = "";
        return;
      }

      const resultCount = total === items.length ? total : `${items.length} of ${total}`;
      metaContainer.textContent = filterLabel
        ? `Showing ${resultCount} results for ${filterLabel}.`
        : `Showing ${resultCount} results.`;

      resultsContainer.innerHTML = items
        .map((result) => {
          const titleHtml = result.highlightedTitle || result.title;
          const snippetHtml = result.snippet || result.excerpt || "";
          const idLabel =
            result.idLabel ?? (result.id !== null && result.id !== undefined ? String(result.id) : null);
          const titlePrefix =
            showQuestionIds && idLabel
              ? `<span class="result-id">#${idLabel}</span> `
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
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
}

if (typeof document !== "undefined") {
  initSearchPage();
}

function normalizeQueryValue(value: string) {
  return value.trim();
}

function updateAuthorButtons(container: HTMLElement, selected: string) {
  const buttons = Array.from(container.querySelectorAll<HTMLButtonElement>("[data-author]"));
  buttons.forEach((button) => {
    const id = button.dataset.author ?? "";
    if (id === selected) {
      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
    } else {
      button.classList.remove("is-active");
      button.setAttribute("aria-pressed", "false");
    }
  });
}

function applyUrlState(rawQuery: string, author: string) {
  const query = normalizeQueryValue(rawQuery);
  const searchParams = new URLSearchParams(window.location.search);
  if (query) {
    searchParams.set("q", query);
  } else {
    searchParams.delete("q");
  }
  if (author) {
    searchParams.set("author", author);
  } else {
    searchParams.delete("author");
  }
  const next = `${window.location.pathname}${searchParams.toString() ? `?${searchParams}` : ""}`;
  window.history.replaceState({}, "", next);
}

function buildFilterLabel(query: string, authorName: string | null) {
  if (query && authorName) {
    return `"${query}" and author: ${authorName}`;
  }
  if (query) {
    return `"${query}"`;
  }
  if (authorName) {
    return `author: ${authorName}`;
  }
  return "";
}
