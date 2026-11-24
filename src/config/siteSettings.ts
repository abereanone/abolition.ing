const appVersion = "0.1.19";
const siteName = "abolition.ing";
const defaultDescription = "Questions & Answers about abortion abolition";
const branding = {
  siteName,
  tagline: defaultDescription,
  description: defaultDescription,
  logoPath: "/images/site-logo.svg",
  logoAlt: `${siteName} logo`,
} as const;
const defaultSiteUrl = "https://abolition.ing";

export const siteSettings = {
  version: appVersion,
  branding,
  issueReportURL: "https://github.com/abereanone/abolition.ing/issues/new",
  longExplanationText: "Extended Answer",
  integrations: {
    // Google Analytics removed 2026-11-24: stats come from Cloudflare (C:/code/site-stats).
    googleAnalyticsId: "",
  },
  openGraph: {
    title: branding.siteName,
    description: branding.description,
    url: defaultSiteUrl,
    image: "/images/og-card.png",
    imageAlt: `${branding.siteName} logo`,
    type: "website",
    twitterCard: "summary_large_image",
  },
  showQuestionId: true,
  showAuthor: true,
  hideAnswersByDefault: false,
  enablePagination: true,
  questionsPerPage: 15,
} as const;

export type SiteSettings = typeof siteSettings;
