// Plain-JS port of src/lib/bible/autoLinkBibleRefs.ts, adapted to *collect* the
// reference strings the client autolinker would turn into hoverable links,
// rather than emit HTML. Kept in sync with autoLinkBibleRefs.ts so the build
// generates verse data for exactly the references the client will request.
//
// Deploy-safe: pure JS, no .ts imports (the prebuild step runs this under plain
// node, where importing .ts is not guaranteed).

const singleChapterBooks = new Set(["obadiah", "oba", "philemon", "phm", "2jn", "3jn", "jude", "jud"]);

export function createRefCollector(bookMap) {
  const bookPattern = Object.keys(bookMap)
    .sort((a, b) => b.length - a.length)
    .map((book) => book.replace(/\./g, "\\."))
    .join("|");

  const singleChapterBookPattern = [...singleChapterBooks]
    .sort((a, b) => b.length - a.length)
    .map((book) => book.replace(/\./g, "\\."))
    .join("|");

  const multiVerseSingleChapterRegex = new RegExp(
    `\\b(${singleChapterBookPattern})\\s+(\\d+(?:[-\\u2013\\u2014]\\d+)?)(?:\\s*,\\s*\\d+(?:[-\\u2013\\u2014]\\d+)?)+`,
    "gi"
  );
  const multiVerseRegex = new RegExp(
    `\\b(${bookPattern})\\s+(\\d+):(\\d+(?:[-\\u2013\\u2014]\\d+)?)(?:\\s*,\\s*\\d+(?::\\d+(?:[-\\u2013\\u2014]\\d+)?)?(?:[-\\u2013\\u2014]\\d+)?)+`,
    "gi"
  );
  const singleVerseSingleChapterRegex = new RegExp(
    `\\b(${singleChapterBookPattern})\\s+(\\d+(?:[-\\u2013\\u2014]\\d+)?)\\b`,
    "gi"
  );
  const singleVerseRegex = new RegExp(
    `\\b(${bookPattern})\\s+(\\d+):(\\d+(?:[-\\u2013\\u2014]\\d+)?)\\b`,
    "gi"
  );
  const chapterOnlyRegex = new RegExp(`\\b(${bookPattern})\\s+(\\d+)\\b(?!\\s*:)`, "gi");
  const continuedVerseRegex = /([;]\s*)(\d+:\d+(?:[-–—]\d+)?)(?=(?:\s*[;),.]|\s*$))/g;

  // Mirrors autoLinkBibleRefs: runs the same passes in the same order, but pushes
  // the data-ref strings it would have produced into `refs` instead of building spans.
  return function collectRefs(html) {
    const refs = [];
    const push = (ref) => refs.push(ref);

    const withChapterOnly = html.replace(chapterOnlyRegex, (match, book, chapter) => {
      const normalizedBook = String(book).toLowerCase().replace(/\./g, "");
      if (singleChapterBooks.has(normalizedBook)) {
        return match;
      }
      push(`${book} ${chapter}`);
      return `<span class="bible-ref" data-ref="${book} ${chapter}">${match}</span>`;
    });

    const placeholders = [];
    const withSingleChapterMulti = withChapterOnly.replace(
      multiVerseSingleChapterRegex,
      (match, book, firstVerse) => {
        push(`${book} ${firstVerse}`);
        let output = `<span class="bible-ref" data-ref="${book} ${firstVerse}">${book} ${firstVerse}</span>`;
        const rest = match.slice(`${book} ${firstVerse}`.length);
        const extraMatches = rest.match(/,\s*\d+(?:[-–—]\d+)?/g) ?? [];
        extraMatches.forEach((chunk) => {
          const verse = chunk.replace(/,\s*/, "");
          push(`${book} ${verse}`);
          output += `${chunk.replace(verse, "")}<span class="bible-ref" data-ref="${book} ${verse}">${verse}</span>`;
        });
        const token = `__BIBLE_MULTI__${placeholders.length}__`;
        placeholders.push(output);
        return token;
      }
    );

    const withMulti = withSingleChapterMulti.replace(
      multiVerseRegex,
      (match, book, chapter, firstVerse) => {
        const baseRef = `${book} ${chapter}`;
        push(`${baseRef}:${firstVerse}`);
        let output = `<span class="bible-ref" data-ref="${baseRef}:${firstVerse}">${book} ${chapter}:${firstVerse}</span>`;
        const rest = match.slice(`${book} ${chapter}:${firstVerse}`.length);
        const extraMatches =
          rest.match(/,\s*\d+(?::\d+(?:[-–—]\d+)?)?(?:[-–—]\d+)?/g) ?? [];
        extraMatches.forEach((chunk) => {
          const verse = chunk.replace(/,\s*/, "");
          const ref = verse.includes(":") ? `${book} ${verse}` : `${baseRef}:${verse}`;
          push(ref);
          output += `${chunk.replace(verse, "")}<span class="bible-ref" data-ref="${ref}">${verse}</span>`;
        });
        const token = `__BIBLE_MULTI__${placeholders.length}__`;
        placeholders.push(output);
        return token;
      }
    );

    const withSingleChapterSingles = withMulti.replace(
      singleVerseSingleChapterRegex,
      (match, book, verse) => {
        push(`${book} ${verse}`);
        return `<span class="bible-ref" data-ref="${book} ${verse}">${match}</span>`;
      }
    );

    const withSingles = withSingleChapterSingles.replace(
      singleVerseRegex,
      (match, book, chapter, verse) => {
        push(`${book} ${chapter}:${verse}`);
        return `<span class="bible-ref" data-ref="${book} ${chapter}:${verse}">${match}</span>`;
      }
    );

    withSingles.replace(
      /((?:<span class="bible-ref" data-ref="([^"]+)">[^<]+<\/span>)(?:[^<]|<(?!span class="bible-ref"))*)/g,
      (segment) => {
        let lastBook = null;
        const seedMatch = segment.match(/data-ref="([^"]+)"/);
        if (seedMatch) {
          const ref = seedMatch[1] ?? "";
          const bookMatch = ref.match(/^(.+?)\s+\d+:\d+/);
          lastBook = bookMatch?.[1] ?? null;
        }
        segment.replace(continuedVerseRegex, (m, _separator, chapterVerse) => {
          if (lastBook) {
            push(`${lastBook} ${chapterVerse}`);
          }
          return m;
        });
        return segment;
      }
    );

    return refs;
  };
}
