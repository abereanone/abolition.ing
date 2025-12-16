const appVersion = '0.1.15';
const siteName = 'abolition.ing';
const defaultDescription = 'Questions & Answers about abortion abolition';
const branding = {
  siteName,
  tagline: defaultDescription,
  description: defaultDescription,
  logoPath: '/images/site-logo.svg',
  logoAlt: `${siteName} logo`,
} as const;
const defaultSiteUrl = 'https://abolition.ing';

export const siteSettings = {
  version: appVersion,
  branding,
  footer: {
    legalText: 'For copyright/licensing information',
    legalLinkLabel: 'click here.',
  },
  integrations: {
    googleAnalyticsId: 'G-0JVE2NPH9S',
  },
  openGraph: {
    title: branding.siteName,
    description: branding.description,
    url: defaultSiteUrl,
    image: '/images/og-card.png',
    imageAlt: `${branding.siteName} logo`,
    type: 'website',
    twitterCard: 'summary_large_image',
  },
  showQuestionId: true,
  showAuthor: true,
  enablePagination: true,
  questionsPerPage: 15,
} as const;

export type SiteSettings = typeof siteSettings;
