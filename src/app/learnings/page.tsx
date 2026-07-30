import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Learnings } from "@/components/Learnings";
import { LearningsJsonLd } from "@/components/JsonLd";
import { learnings, currentlyLearning, personalInfo, siteMetadata } from "@/lib/data";
import { highlightLearning } from "@/lib/highlight";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: `Field Notes | ${personalInfo.name}`,
  description:
    "Patterns, laws, and paradigms collected in production — with code examples in TypeScript, Go, and Python.",
  path: "/learnings/",
});

const LearningsPage = async () => {
  const items = await Promise.all(
    learnings.map(async (learning) => ({
      learning,
      html: await highlightLearning(learning),
    }))
  );

  return (
    <main className="min-h-screen">
      <LearningsJsonLd url={`${siteMetadata.siteUrl}/learnings/`} />
      <Navbar />
      <Learnings items={items} currentlyLearning={currentlyLearning} />
      <Footer />
      <ThemeSwitcher variant="floating" />
    </main>
  );
};

export default LearningsPage;
