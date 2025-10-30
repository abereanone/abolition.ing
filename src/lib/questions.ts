import questionsData from "@/data/questions.json";
import categoriesData from "@/data/categories.json";

type Question = (typeof questionsData)[number];
type Category = (typeof categoriesData)[number];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function sortQuestions(list: Question[]): Question[] {
  return [...list].sort((a, b) => {
    const orderA = typeof a.sortOrder === "number" ? a.sortOrder : Number.MAX_SAFE_INTEGER;
    const orderB = typeof b.sortOrder === "number" ? b.sortOrder : Number.MAX_SAFE_INTEGER;

    if (orderA !== orderB) {
      return orderA - orderB;
    }

    return a.title.localeCompare(b.title);
  });
}

const publishedQuestions = sortQuestions(
  questionsData.filter((question) => question.published)
);

interface CategorySummary {
  id: string;
  name: string;
  count: number;
}

function buildCategoryMap(): Map<string, CategorySummary> {
  const map = new Map<string, CategorySummary>();

  categoriesData.forEach((category: Category) => {
    const slug = slugify(category.id);
    map.set(slug, { id: slug, name: category.name, count: 0 });
  });

  publishedQuestions.forEach((question) => {
    const seen = new Set<string>();

    question.categories.forEach((label) => {
      const slug = slugify(label);

      if (!map.has(slug)) {
        map.set(slug, { id: slug, name: label, count: 0 });
      }

      if (!seen.has(slug)) {
        const entry = map.get(slug);
        if (entry) {
          entry.count += 1;
          seen.add(slug);
        }
      }
    });
  });

  return map;
}

const categoryMap = buildCategoryMap();
const categoryList = Array.from(categoryMap.values()).sort((a, b) =>
  a.name.localeCompare(b.name)
);

export function getPublishedQuestions(categoryId?: string): Question[] {
  if (!categoryId) {
    return publishedQuestions;
  }

  const slug = slugify(categoryId);

  return publishedQuestions.filter((question) =>
    question.categories.some((label) => slugify(label) === slug)
  );
}

export function listCategories(): CategorySummary[] {
  return categoryList;
}

export function findCategory(categoryId: string): CategorySummary | null {
  const slug = slugify(categoryId);
  return categoryMap.get(slug) ?? null;
}

export function findQuestion(slug: string): Question | null {
  return questionsData.find((question) => question.slug === slug) ?? null;
}

export function getQuestionCategories(question: Question) {
  const seen = new Set<string>();
  const result: Array<{ id: string; name: string }> = [];

  question.categories.forEach((label) => {
    const slug = slugify(label);
    const entry = categoryMap.get(slug) ?? { id: slug, name: label };

    if (!seen.has(entry.id)) {
      seen.add(entry.id);
      result.push(entry);
    }
  });

  return result;
}

export { slugify };
