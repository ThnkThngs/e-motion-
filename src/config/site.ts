/**
 * Central site configuration.
 * Update these values before deploying. Use .env.local env vars in production.
 */
export const siteConfig = {
  name: "e-motion.my",
  tagline: "Kad Jemputan Digital Warisan Edition",
  /** Malaysian format, no +, used in wa.me links */
  contactWa: process.env.NEXT_PUBLIC_CONTACT_WA ?? "601139697861",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@e-motion.my",
  /** Production base URL — no trailing slash */
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "https://e-motion.my",
} as const;
