import { HeroHeader, ContentSection } from "@/types/contents"

/* ====================
[> CUSTOMIZING CONTENT <]
-- Setup image by typing `/image-name.file` (Example: `/header-image.jpg`)
-- Add images by adding files to /public folder
-- Leave blank `` if you don't want to put texts or images
 ==================== */

export const heroHeader: HeroHeader = {
  header: `autosearch.lol`,
  subheader: `Your space ship for navigating the knowledge of the internet`,
  image: `/hero-img.webp`,
}

export const featureCards: ContentSection = {
  header: `How it works`,
  subheader: `Easy to use super advanced search`,
  content: [
    {
      text: `Enter a search query`,
      subtext: `Then see the results be updated as new sub searches are performed.`,
      icon: "",
    },
    // {
    //   text: `2. Describe where you want to appear`,
    //   subtext: `You can get assistance from an AI brainstorm buddy`,
    //   icon: "shadcnUi",
    // },
    // {
    //   text: `3. Generate Image`,
    //   subtext: `Image is generated and ready to post to Instagram or other social media platforms`,
    //   icon: "vercel",
    // },
  ],
}

export const features: ContentSection = {
  header: `Features`,
  subheader: `Why use autosearch.lol?`,
  image: `/features-img.webp`,
  content: [
    {
      text: `augment your mind`,
      subtext: `superhuman intelligence with AI`,
      icon: "settings",
    },
    // {
    //   text: `Highly Performant`,
    //   subtext: `Fast loading times and smooth performance`,
    //   icon: "barChart",
    // },
    // {
    //   text: `Easy Customizability`,
    //   subtext: `Change your content and layout with little effort`,
    //   icon: "settings",
    // },
  ],
}
