import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import Learnings from "@/components/Learnings";
import { learnings, currentlyLearning, personalInfo, siteMetadata } from "@/lib/data";
import { highlightLearning } from "@/lib/highlight";

export const metadata: Metadata = {
  title: `Field Notes | ${personalInfo.name}`,
  description:
    "Patterns, laws, and paradigms collected in production — with code examples in TypeScript, Go, and Python.",
  alternates: {
    canonical: `${siteMetadata.siteUrl}/learnings`,
  },
};

export default async function LearningsPage() {
  const items = await Promise.all(
    learnings.map(async (learning) => ({
      learning,
      html: await highlightLearning(learning),
    }))
  );

  return (
    <main className="min-h-screen">
      <Navbar />
      <Learnings items={items} currentlyLearning={currentlyLearning} />
      <Footer />
      <ThemeSwitcher variant="floating" />
    </main>
  );
}
