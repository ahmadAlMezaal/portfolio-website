import type { Metadata } from "next";
import { personalInfo, siteMetadata } from "@/lib/data";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

const DEFAULT_OG_IMAGE = "og-image.png";

export const ogImageUrl = `${siteMetadata.siteUrl}/${DEFAULT_OG_IMAGE}`;

export const pageMetadata = ({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
}: PageMetadataInput): Metadata => {
  const url = `${siteMetadata.siteUrl}${path}`;
  const imageUrl = `${siteMetadata.siteUrl}/${image}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: siteMetadata.locale,
      url,
      siteName: personalInfo.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: siteMetadata.twitterHandle,
      images: [imageUrl],
    },
  };
};
