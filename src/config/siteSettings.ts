export const siteSettings = {
  showQuestionId: false,
  showAuthor: true,
  enablePagination: true,
  questionsPerPage: 10,
} as const;

export type SiteSettings = typeof siteSettings;
