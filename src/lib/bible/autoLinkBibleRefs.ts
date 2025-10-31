import bookMap from "./bookMap.json";

const bookPattern = Object.keys(bookMap)
  .sort((a, b) => b.length - a.length)
  .map((book) => book.replace(/\./g, "\\."))
  .join("|");

const referenceRegex = new RegExp(
  `\\b(${bookPattern})\\s+(\\d+(?::\\d+(?:[-\\u2013\\u2014]\\d+)?)?)\\b`,
  "gi"
);

export function autoLinkBibleRefs(html: string): string {
  return html.replace(referenceRegex, (match, book: string, chapterVerse: string) => {
    const ref = `${book} ${chapterVerse}`;
    return `<span class="bible-ref" data-ref="${ref}">${match}</span>`;
  });
}
