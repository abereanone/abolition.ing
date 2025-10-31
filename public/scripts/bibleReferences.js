const bookMap = {
  genesis: "gen",
  gen: "gen",
  ge: "gen",
  exodus: "exo",
  exo: "exo",
  ex: "exo",
  leviticus: "lev",
  lev: "lev",
  le: "lev",
  numbers: "num",
  num: "num",
  nu: "num",
  nm: "num",
  deuteronomy: "deu",
  deu: "deu",
  dt: "deu",
  joshua: "jos",
  jos: "jos",
  jo: "jos",
  judges: "jdg",
  jdg: "jdg",
  jg: "jdg",
  ruth: "rut",
  rut: "rut",
  ru: "rut",
  "1 samuel": "1sa",
  "1sa": "1sa",
  "1 sam": "1sa",
  "1s": "1sa",
  "2 samuel": "2sa",
  "2sa": "2sa",
  "2 sam": "2sa",
  "2s": "2sa",
  "1 kings": "1ki",
  "1ki": "1ki",
  "1k": "1ki",
  "2 kings": "2ki",
  "2ki": "2ki",
  "2k": "2ki",
  "1 chronicles": "1ch",
  "1ch": "1ch",
  "1 chr": "1ch",
  "2 chronicles": "2ch",
  "2ch": "2ch",
  "2 chr": "2ch",
  ezra: "ezr",
  ezr: "ezr",
  ez: "ezr",
  nehemiah: "neh",
  neh: "neh",
  ne: "neh",
  esther: "est",
  est: "est",
  es: "est",
  job: "job",
  jb: "job",
  psalms: "psa",
  psalm: "psa",
  ps: "psa",
  psa: "psa",
  proverbs: "pro",
  prov: "pro",
  pr: "pro",
  pro: "pro",
  ecclesiastes: "ecc",
  ecc: "ecc",
  ec: "ecc",
  "song of songs": "sng",
  "song of solomon": "sng",
  song: "sng",
  so: "sng",
  sng: "sng",
  isaiah: "isa",
  isa: "isa",
  is: "isa",
  jeremiah: "jer",
  jer: "jer",
  je: "jer",
  lamentations: "lam",
  lam: "lam",
  la: "lam",
  ezekiel: "ezk",
  ezk: "ezk",
  ek: "ezk",
  daniel: "dan",
  dan: "dan",
  da: "dan",
  dn: "dan",
  hosea: "hos",
  hos: "hos",
  ho: "hos",
  joel: "jol",
  jol: "jol",
  jl: "jol",
  amos: "amo",
  amo: "amo",
  am: "amo",
  obadiah: "oba",
  oba: "oba",
  ob: "oba",
  jonah: "jon",
  jon: "jon",
  joa: "jon",
  micah: "mic",
  mic: "mic",
  mi: "mic",
  nahum: "nah",
  nah: "nah",
  na: "nah",
  habakkuk: "hab",
  hab: "hab",
  ha: "hab",
  zephaniah: "zep",
  zep: "zep",
  zp: "zep",
  haggai: "hag",
  hag: "hag",
  hg: "hag",
  zechariah: "zec",
  zec: "zec",
  zc: "zec",
  malachi: "mal",
  mal: "mal",
  ml: "mal",
  matthew: "mat",
  mat: "mat",
  mt: "mat",
  mark: "mrk",
  mrk: "mrk",
  mk: "mrk",
  luke: "luk",
  luk: "luk",
  lk: "luk",
  john: "jhn",
  jhn: "jhn",
  jn: "jhn",
  acts: "act",
  act: "act",
  ac: "act",
  romans: "rom",
  rom: "rom",
  ro: "rom",
  rm: "rom",
  "1 corinthians": "1co",
  "1co": "1co",
  "1 cor": "1co",
  "1c": "1co",
  "2 corinthians": "2co",
  "2co": "2co",
  "2 cor": "2co",
  "2c": "2co",
  galatians: "gal",
  gal: "gal",
  ga: "gal",
  ephesians: "eph",
  eph: "eph",
  ep: "eph",
  philippians: "php",
  php: "php",
  ph: "php",
  colossians: "col",
  col: "col",
  co: "col",
  "1 thessalonians": "1th",
  "1th": "1th",
  "1 thes": "1th",
  "1 th": "1th",
  "2 thessalonians": "2th",
  "2th": "2th",
  "2 thes": "2th",
  "2 th": "2th",
  "1 timothy": "1ti",
  "1ti": "1ti",
  "1 tim": "1ti",
  "1t": "1ti",
  "2 timothy": "2ti",
  "2ti": "2ti",
  "2 tim": "2ti",
  "2t": "2ti",
  titus: "tit",
  tit: "tit",
  ti: "tit",
  philemon: "phm",
  phm: "phm",
  pm: "phm",
  hebrews: "heb",
  heb: "heb",
  he: "heb",
  james: "jas",
  jas: "jas",
  jam: "jas",
  jm: "jas",
  "1 peter": "1pe",
  "1pe": "1pe",
  "1 pt": "1pe",
  "1p": "1pe",
  "2 peter": "2pe",
  "2pe": "2pe",
  "2 pt": "2pe",
  "2p": "2pe",
"1 john": "1jn",
"1john": "1jn",
"2 john": "2jn",
"2john": "2jn",
"3 john": "3jn",
"3john": "3jn",
  "1 jn": "1jn",
  "2 jn": "2jn",
  "3 jn": "3jn",
  "1jn": "1jn",
  "2jn": "2jn",
  "3jn": "3jn",
  jude: "jud",
  jud: "jud",
  ju: "jud",
  revelation: "rev",
  revelations: "rev",
  rev: "rev",
  re: "rev"
};

const singleChapterBooks = new Set([
  "obadiah",
  "oba",
  "philemon",
  "phm",
"2 john",
"2jn",
"2john",
"3 john",
"3jn",
"3john",
  "jude",
  "jud"
]);

function normalizeReference(reference) {
  const lower = reference.trim().toLowerCase().replace(/\u2013|\u2014/g, "-");
  const parts = lower.split(/\s+/);

  if (parts.length < 2) {
    return reference;
  }

  const book = parts.slice(0, -1).join(" ");
  let chapterAndVerse = parts[parts.length - 1];

  if (/^\d+$/.test(chapterAndVerse) && singleChapterBooks.has(book)) {
    chapterAndVerse = `1:${chapterAndVerse}`;
  }

  const cleaned = book.replace(/\./g, "");
  const normalizedBook =
    bookMap[book] ||
    bookMap[book.charAt(0).toUpperCase() + book.slice(1)] ||
    bookMap[cleaned] ||
    bookMap[cleaned.charAt(0).toUpperCase() + cleaned.slice(1)];

  if (!normalizedBook) {
    return reference;
  }

  if (/^\d+$/.test(chapterAndVerse) && singleChapterBooks.has(normalizedBook)) {
    chapterAndVerse = `1:${chapterAndVerse}`;
  }

  return `${normalizedBook} ${chapterAndVerse}`;
}

const bookPattern = Object.keys(bookMap)
  .sort((a, b) => b.length - a.length)
  .map((book) => book.replace(/\./g, "\\."))
  .join("|");

const referenceRegex = new RegExp(
  `\\b(${bookPattern})\\s+(\\d+(?::\\d+(?:[-\\u2013\\u2014]\\d+)?)?)\\b`,
  "gi"
);

function autoLinkBibleRefs(html) {
  return html.replace(referenceRegex, (match, book, chapterVerse) => {
    const ref = `${book} ${chapterVerse}`;
    return `<span class="bible-ref" data-ref="${ref}">${match}</span>`;
  });
}

const verseCache = new Map();

async function getVerse(reference) {
  if (verseCache.has(reference)) {
    return verseCache.get(reference);
  }

  const [bookCode, chapterAndVerses] = reference.split(" ");
  if (!chapterAndVerses) {
    return "";
  }

  const [chapterPart, verseSegment] = chapterAndVerses.split(":");
  const chapterNumber = parseInt(chapterPart, 10);

  if (!verseSegment || Number.isNaN(chapterNumber)) {
    return "";
  }

  const [startRaw, endRaw] = verseSegment.split("-").map((value) => parseInt(value, 10));
  const verseStart = startRaw;
  const verseEnd = typeof endRaw === "number" && !Number.isNaN(endRaw) ? endRaw : startRaw;

  try {
    const response = await fetch(
      `https://v1.fetch.bible/bibles/eng_bsb/txt/${bookCode}.json`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ${bookCode}: ${response.status}`);
    }

    const data = await response.json();
    const contents = data.contents || {};
    const chapterEntries = contents[chapterNumber] || contents[String(chapterNumber)];

    if (!chapterEntries) {
      return "";
    }

    const verses = [];

    for (let v = verseStart; v <= verseEnd; v += 1) {
      const pieces =
        chapterEntries[v] ||
        chapterEntries[String(v)] ||
        [];

      const items = Array.isArray(pieces) ? pieces : [pieces];

      const text = items
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }
          if (item && typeof item === "object") {
            if (item.type === "note" || item.type === "heading") {
              return "";
            }
            if (typeof item.contents === "string") {
              return item.contents;
            }
          }
          return "";
        })
        .join("")
        .trim();

      if (text) {
        verses.push(`${v} ${text}`);
      }
    }

    const compiled = verses.join(" ");
    verseCache.set(reference, compiled);
    return compiled;
  } catch (error) {
    console.error("Error fetching verse:", reference, error);
    return "";
  }
}

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

function initBibleReferences() {
  if (window.__bibleReferencesInitialized) {
    scan();
    return;
  }

  window.__bibleReferencesInitialized = true;

  document.addEventListener("astro:page-load", scan);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scan, { once: true });
  } else {
    scan();
  }
}

initBibleReferences();
