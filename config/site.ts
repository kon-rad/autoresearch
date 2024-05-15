import { SiteConfig, ContactConfig } from "@/types"

/* ====================
[> WEBSITE CONFIG <]
-- Fill the details about your website
 ==================== */

const baseUrl = "https://autosearch.lol"

export const siteConfig: SiteConfig = {
  name: "autoSearch",
  author: "kon-rad",
  description:
    "autosearch is the AI search tool to navigate the deep knowledge of the internet",
  keywords: [
    "search",
    "AI",
    "agents",
    "superhuman intelligence",
    "agi"
  ],
  url: {
    base: baseUrl,
    author: "https://konradgnat.com",
  },
  ogImage: `${baseUrl}/og.jpg`,
}

export const contactConfig: ContactConfig = {
  email: "syndcuer@gmail.com",
}
