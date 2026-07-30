import type { MetadataRoute } from "next";
import { siteMetadata } from "@/lib/data";

export const dynamic = "force-static";

const lastModified = new Date();

const sitemap = (): MetadataRoute.Sitemap => {
  const { siteUrl } = siteMetadata;
  return [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/projects/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/learnings/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/bookmarks/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];
};

export default sitemap;
