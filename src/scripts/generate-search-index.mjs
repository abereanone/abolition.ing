import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(currentDir, "..", "..");
const QUESTIONS_DIR = path.join(ROOT_DIR, "src", "data", "questions");
const CATEGORIES_FILE = path.join(ROOT_DIR, "src", "data", "categories.json");
const CONTENT_DIR = path.join(ROOT_DIR, "src", "content", "questions");
const OUTPUT_FILE = path.join(ROOT_DIR, "src", "data", "search-index.json");

async function loadQuestions() {
  const files = await fs.readdir(QUESTIONS_DIR);
  const all = [];

  for (const file of files.filter((name) => name.endsWith(".json"))) {
    const fullPath = path.join(QUESTIONS_DIR, file);
    const raw = await fs.readFile(fullPath, "utf-8");

    try {
      const entries = JSON.parse(raw);
      if (Array.isArray(entries)) {
        all.push(...entries);
      } else {
        console.warn(`Skipping ${file}: expected an array of questions.`);
      }
    } catch (error) {
      console.error(`Failed to parse ${file}:`, error);
      throw error;
    }
  }

  return all.filter((entry) => entry && entry.published);
}

async function loadCategories() {
  const raw = await fs.readFile(CATEGORIES_FILE, "utf-8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to parse categories.json:", error);
    throw error;
  }
}

async function loadMarkdownFile(filename) {
  if (!filename) return "";
  const fullPath = path.join(CONTENT_DIR, filename);

  try {
    const raw = await fs.readFile(fullPath, "utf-8");
    return raw;
  } catch (error) {
    console.warn(`Missing markdown file for ${filename}:`, error);
    return "";
  }
}

function cleanMarkdown(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]\(([^)]+)\)/g, "$1")
    .replace(/[*_~#>]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildExcerpt(text, wordLimit = 40) {
  if (!text) return "";
  const words = text.split(/\s+/).filter(Boolean);
  const slice = words.slice(0, wordLimit).join(" ");
  return slice + (words.length > wordLimit ? "…" : "");
}

async function buildSearchIndex() {
  const questions = await loadQuestions();
  const categories = await loadCategories();
  const categoryMap = new Map();
  categories.forEach((category) => {
    const slug = slugify(category.id);
    categoryMap.set(slug, category);
  });
  const documents = [];

  for (const question of questions) {
    const markdownContent = await loadMarkdownFile(question.markdown);
    const cleaned = cleanMarkdown(markdownContent);
    const groupCodes = deriveGroupCodes(question.categories ?? [], categoryMap);
    const idLabel =
      groupCodes.length && typeof question.id === "number"
        ? `${groupCodes[0]}${question.id}`
        : question.id != null
          ? String(question.id)
          : null;

    documents.push({
      id: question.id ?? null,
      idLabel,
      slug: question.slug,
      title: question.title,
      categories: question.categories ?? [],
      relatedAnswers: question.relatedAnswers ?? [],
      excerpt: buildExcerpt(cleaned),
      content: cleaned,
      groupCodes,
      authorIds: deriveAuthorIds(question),
    });
  }

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(documents, null, 2));
  console.log(`Search index generated with ${documents.length} documents.`);
}

buildSearchIndex().catch((error) => {
  console.error("Failed to build search index", error);
  process.exitCode = 1;
});

function slugify(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function deriveGroupCodes(categories = [], categoryMap = new Map()) {
  const codes = new Set();
  categories.forEach((label) => {
    const slug = slugify(label);
    const entry = categoryMap.get(slug);
    if (entry?.groupCode) {
      codes.add(String(entry.groupCode).toUpperCase());
    }
  });
  return [...codes];
}

function deriveAuthorIds(question = {}) {
  const ids = new Set();
  if (question.authorId) {
    ids.add(String(question.authorId));
  }
  if (question.longAuthorId) {
    ids.add(String(question.longAuthorId));
  }
  return [...ids];
}
