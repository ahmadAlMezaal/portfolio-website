import type { MetadataRoute } from "next";
import { siteMetadata } from "@/lib/data";

export const dynamic = "force-static";

const robots = (): MetadataRoute.Robots => {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
    host: siteMetadata.siteUrl,
  };
};

export default robots;
