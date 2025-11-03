export const siteSettings = {
  showQuestionId: true,
  showAuthor: true,
  enablePagination: true,
  questionsPerPage: 20,
} as const;

export type SiteSettings = typeof siteSettings;
