import type { MetadataRoute } from "next";
import { siteMetadata } from "@/lib/data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const { siteUrl } = siteMetadata;
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/#about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/#skills`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/#experience`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/#projects`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/learnings`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/#contact`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
