export const siteSettings = {
  showQuestionId: false,
  showAuthor: true,
} as const;

export type SiteSettings = typeof siteSettings;
