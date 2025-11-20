const appVersion = '0.1.12';
const siteName = 'abolition.ing';
const defaultDescription = 'Questions & Answers about abortion abolition';

export const siteSettings = {
  version: appVersion,
  branding: {
    siteName,
    tagline: defaultDescription,
    description: defaultDescription,
    logoPath: '/images/site-logo.svg',
    logoAlt: `${siteName} logo`,
  },
  footer: {
    legalText: 'For copyright/licensing information',
    legalLinkLabel: 'click here.',
  },
  integrations: {
    googleAnalyticsId: 'G-0JVE2NPH9S',
  },
  showQuestionId: true,
  showAuthor: true,
  enablePagination: true,
  questionsPerPage: 15,
} as const;

export type SiteSettings = typeof siteSettings;
