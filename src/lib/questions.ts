import questionsData from "@/data/questions.json";
import categoriesData from "@/data/categories.json";
import authorsData from "@/data/authors.json";

type Question = (typeof questionsData)[number];
type Category = (typeof categoriesData)[number];
type Author = (typeof authorsData)[number];

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
  sortOrder?: number;
}

interface AuthorSummary {
  id: string;
  name: string;
  count: number;
  url?: string;
  bio?: string;
  sortOrder?: number;
}

function buildCategoryMap(): Map<string, CategorySummary> {
  const map = new Map<string, CategorySummary>();

  categoriesData.forEach((category: Category) => {
    const slug = slugify(category.id);
    map.set(slug, {
      id: slug,
      name: category.name,
      count: 0,
      sortOrder: typeof category.sortOrder === "number" ? category.sortOrder : undefined,
    });
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

function buildAuthorMap(): Map<string, AuthorSummary> {
  const map = new Map<string, AuthorSummary>();

  authorsData.forEach((author: Author) => {
    const slug = slugify(author.id || author.name);
    map.set(slug, {
      id: slug,
      name: author.name,
      url: author.url,
      bio: author.bio,
      sortOrder: typeof author.sortOrder === "number" ? author.sortOrder : undefined,
      count: 0,
    });
  });

  publishedQuestions.forEach((question) => {
    if (!question.authorId) {
      return;
    }

    const slug = slugify(question.authorId);
    const entry =
      map.get(slug) ??
      (() => {
        const fallback = { id: slug, name: question.authorId, count: 0 };
        map.set(slug, fallback);
        return fallback;
      })();

    entry.count += 1;
  });

  return map;
}

const categoryMap = buildCategoryMap();
const categoryList = Array.from(categoryMap.values()).sort((a, b) => {
  const orderA = typeof a.sortOrder === "number" ? a.sortOrder : Number.MAX_SAFE_INTEGER;
  const orderB = typeof b.sortOrder === "number" ? b.sortOrder : Number.MAX_SAFE_INTEGER;

  if (orderA !== orderB) {
    return orderA - orderB;
  }

  return a.name.localeCompare(b.name);
});

const authorMap = buildAuthorMap();
const authorList = Array.from(authorMap.values()).sort((a, b) => {
  const orderA = typeof a.sortOrder === "number" ? a.sortOrder : Number.MAX_SAFE_INTEGER;
  const orderB = typeof b.sortOrder === "number" ? b.sortOrder : Number.MAX_SAFE_INTEGER;

  if (orderA !== orderB) {
    return orderA - orderB;
  }

  return a.name.localeCompare(b.name);
});

export function getPublishedQuestions(categoryId?: string): Question[] {
  if (!categoryId) {
    return publishedQuestions;
  }

  const slug = slugify(categoryId);

  return publishedQuestions.filter((question) =>
    question.categories.some((label) => slugify(label) === slug)
  );
}

export function getQuestionsByAuthor(authorId: string): Question[] {
  const slug = slugify(authorId);

  return publishedQuestions.filter(
    (question) => question.authorId && slugify(question.authorId) === slug
  );
}

export function listCategories(): CategorySummary[] {
  return categoryList;
}

export function findCategory(categoryId: string): CategorySummary | null {
  const slug = slugify(categoryId);
  return categoryMap.get(slug) ?? null;
}

export function listAuthors(): AuthorSummary[] {
  return authorList;
}

export function findAuthor(authorId: string): AuthorSummary | null {
  const slug = slugify(authorId);
  return authorMap.get(slug) ?? null;
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

export function getQuestionAuthor(question: Question): AuthorSummary | null {
  if (!question.authorId) {
    return null;
  }

  const slug = slugify(question.authorId);
  return authorMap.get(slug) ?? null;
}

export { slugify };
