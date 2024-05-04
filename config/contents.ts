import { HeroHeader, ContentSection } from "@/types/contents"

/* ====================
[> CUSTOMIZING CONTENT <]
-- Setup image by typing `/image-name.file` (Example: `/header-image.jpg`)
-- Add images by adding files to /public folder
-- Leave blank `` if you don't want to put texts or images
 ==================== */

export const heroHeader: HeroHeader = {
  header: `Free your immagination`,
  subheader: `AI generated images and video for your social media`,
  image: `/hero-img.webp`,
}

export const featureCards: ContentSection = {
  header: `How it works`,
  subheader: `Easy to use AI generated content`,
  content: [
    {
      text: `1. Take a screenshot`,
      subtext: `This photo will be the basis for the AI generated image`,
      icon: "nextjs",
    },
    {
      text: `2. Describe where you want to appear`,
      subtext: `You can get assistance from an AI brainstorm buddy`,
      icon: "shadcnUi",
    },
    {
      text: `3. Generate Image`,
      subtext: `Image is generated and ready to post to Instagram or other social media platforms`,
      icon: "vercel",
    },
  ],
}

export const features: ContentSection = {
  header: `Features`,
  subheader: `Why use worldforager?`,
  image: `/features-img.webp`,
  content: [
    {
      text: `SEO Optimized`,
      subtext: `Improved website visibility on search engines`,
      icon: "fileSearch",
    },
    {
      text: `Highly Performant`,
      subtext: `Fast loading times and smooth performance`,
      icon: "barChart",
    },
    {
      text: `Easy Customizability`,
      subtext: `Change your content and layout with little effort`,
      icon: "settings",
    },
  ],
}
