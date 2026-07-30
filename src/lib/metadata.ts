import type { Metadata } from "next";
import { personalInfo, siteMetadata } from "@/lib/data";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
};

export const ogImageUrl = `${siteMetadata.siteUrl}/og-image.png`;

export const pageMetadata = ({
  title,
  description,
  path,
}: PageMetadataInput): Metadata => {
  const url = `${siteMetadata.siteUrl}${path}`;

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
          url: ogImageUrl,
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
      images: [ogImageUrl],
    },
  };
};
