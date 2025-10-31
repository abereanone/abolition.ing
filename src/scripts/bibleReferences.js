import { autoLinkBibleRefs } from "@/lib/bible/autoLinkBibleRefs";
import { normalizeReference } from "@/lib/bible/normalizeRef";
import { getVerse } from "@/lib/bible/bibleClient";

const verseCache = new Map();

function ensureTooltip(element) {
  if (element.__tooltipElement) {
    const tooltip = element.__tooltipElement;
    positionTooltip(element, tooltip);
    tooltip.style.display = "block";
    return Promise.resolve(tooltip);
  }

  const normalized = normalizeReference(element.dataset.ref);

  return Promise.resolve()
    .then(async () => {
      let verse = verseCache.get(normalized);
      if (!verse) {
        verse = await getVerse(normalized);
        verseCache.set(normalized, verse);
      }

      const tooltip = document.createElement("div");
      tooltip.className = "bible-tooltip";
      tooltip.textContent = verse || "Verse not found.";
      document.body.appendChild(tooltip);

      element.__tooltipElement = tooltip;
      positionTooltip(element, tooltip);
      tooltip.style.display = "block";
      return tooltip;
    })
    .catch((error) => {
      console.error("Unable to load verse text:", error);
      return undefined;
    });
}

function positionTooltip(anchor, tooltip) {
  const rect = anchor.getBoundingClientRect();

  tooltip.style.visibility = "hidden";
  tooltip.style.display = "block";

  const tooltipWidth = tooltip.offsetWidth;
  const viewportWidth = window.innerWidth;
  let left = rect.left + window.scrollX;

  if (left + tooltipWidth > viewportWidth - 16) {
    left = viewportWidth - tooltipWidth - 16;
  }
  if (left < 16) {
    left = 16;
  }

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${rect.bottom + window.scrollY + 8}px`;

  tooltip.style.display = "none";
  tooltip.style.visibility = "visible";
}

function hideTooltip(element) {
  if (element.__tooltipElement) {
    element.__tooltipElement.style.display = "none";
  }
}

function enhanceElement(element) {
  if (element.dataset.bibleTooltipState === "ready") {
    return;
  }

  const handleEnter = () => {
    element.dataset.bibleTooltipState = "pending";
    ensureTooltip(element).finally(() => {
      element.dataset.bibleTooltipState = "ready";
    });
  };

  const handleLeave = () => hideTooltip(element);

  element.addEventListener("mouseenter", handleEnter);
  element.addEventListener("focus", handleEnter);
  element.addEventListener("mouseleave", handleLeave);
  element.addEventListener("blur", handleLeave);

  element.dataset.bibleTooltipState = "ready";
}

function processScope(scope) {
  if (scope.dataset.bibleProcessed !== "true") {
    scope.innerHTML = autoLinkBibleRefs(scope.innerHTML);
    scope.dataset.bibleProcessed = "true";
  }

  scope.querySelectorAll(".bible-ref").forEach((el) => {
    enhanceElement(el);
  });
}

function scan() {
  document
    .querySelectorAll("[data-bible-autolink]")
    .forEach((scope) => processScope(scope));
}

document.addEventListener("astro:page-load", scan);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", scan);
} else {
  scan();
}

export {};
