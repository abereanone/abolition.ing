const appVersion = '0.0.1';

export const siteSettings = {
  version: appVersion,
  showQuestionId: true,
  showAuthor: true,
  enablePagination: true,
  questionsPerPage: 10,
} as const;

export type SiteSettings = typeof siteSettings;



