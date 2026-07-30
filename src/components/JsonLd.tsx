import { learnings, personalInfo, siteMetadata } from "@/lib/data";

const buildDate = new Date().toISOString().split("T")[0];

const [locality, country] = personalInfo.location
  .split(",")
  .map((part) => part.trim());

const address = {
  "@type": "PostalAddress",
  ...(locality ? { addressLocality: locality } : {}),
  ...(country ? { addressCountry: country } : {}),
};

interface JsonLdProps {
  url: string;
}

const LdScript = ({ schema }: { schema: object }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
  />
);

export const JsonLd = ({ url }: JsonLdProps) => {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: personalInfo.name,
    jobTitle: personalInfo.title,
    description: siteMetadata.description,
    url: url,
    address,
    sameAs: personalInfo.socialLinks.map((link) => link.url),
    ...(personalInfo.knowsAbout?.length
      ? { knowsAbout: personalInfo.knowsAbout }
      : {}),
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

  return (
    <>
      <LdScript schema={personSchema} />
      <LdScript schema={websiteSchema} />
    </>
  );
};

export const ProfileJsonLd = ({ url }: JsonLdProps) => {
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
    ...(siteMetadata.launched ? { dateCreated: siteMetadata.launched } : {}),
    dateModified: buildDate,
  };

  return <LdScript schema={profilePageSchema} />;
};

export const LearningsJsonLd = ({ url }: JsonLdProps) => {
  if (learnings.length === 0) return null;

  const author = {
    "@type": "Person",
    name: personalInfo.name,
    url: siteMetadata.siteUrl,
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Field Notes",
    url,
    author,
    hasPart: learnings.map((learning) => ({
      "@type": "TechArticle",
      headline: learning.title,
      abstract: learning.oneLiner,
      articleSection: learning.category,
      author,
      inLanguage: "en",
      isAccessibleForFree: true,
      programmingLanguage: Object.keys(learning.code),
    })),
  };

  return <LdScript schema={collectionSchema} />;
};
