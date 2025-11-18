import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(currentDir, "..", "..");
const QUESTIONS_DIR = path.join(ROOT_DIR, "src", "data", "questions");
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
  const documents = [];

  for (const question of questions) {
    const markdownContent = await loadMarkdownFile(question.markdown);
    const cleaned = cleanMarkdown(markdownContent);

    documents.push({
      id: question.id ?? null,
      slug: question.slug,
      title: question.title,
      categories: question.categories ?? [],
      relatedAnswers: question.relatedAnswers ?? [],
      excerpt: buildExcerpt(cleaned),
      content: cleaned,
    });
  }

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(documents, null, 2));
  console.log(`Search index generated with ${documents.length} documents.`);
}

buildSearchIndex().catch((error) => {
  console.error("Failed to build search index", error);
  process.exitCode = 1;
});
