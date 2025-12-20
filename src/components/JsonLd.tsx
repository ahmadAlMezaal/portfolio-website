"use client";

import { personalInfo, siteMetadata } from "@/lib/data";

interface JsonLdProps {
  url: string;
}

export default function JsonLd({ url }: JsonLdProps) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: personalInfo.name,
    jobTitle: personalInfo.title,
    description: siteMetadata.description,
    email: `mailto:${personalInfo.email}`,
    url: url,
    address: {
      "@type": "PostalAddress",
      addressLocality: personalInfo.location.split(",")[0]?.trim(),
      addressCountry: personalInfo.location.split(",")[1]?.trim() || "UK",
    },
    sameAs: personalInfo.socialLinks.map((link) => link.url),
    knowsAbout: [
      "Software Engineering",
      "Backend Development",
      "Fintech",
      "Open Banking",
      "Node.js",
      "TypeScript",
      "AWS",
      "Cloud-Native Systems",
      "React",
      "React Native",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: personalInfo.name,
    url: url,
    description: siteMetadata.description,
    author: {
      "@type": "Person",
      name: personalInfo.name,
    },
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: personalInfo.name,
      jobTitle: personalInfo.title,
      description: personalInfo.bio,
      url: url,
    },
    dateCreated: "2024-01-01",
    dateModified: new Date().toISOString().split("T")[0],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(profilePageSchema),
        }}
      />
    </>
  );
}
