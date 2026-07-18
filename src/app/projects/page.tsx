import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import { personalInfo, siteMetadata } from "@/lib/data";

export const metadata: Metadata = {
  title: `Projects | ${personalInfo.name}`,
  description: `A complete collection of ${personalInfo.name}'s work — live products, in-progress builds, and private engagements.`,
  alternates: {
    canonical: `${siteMetadata.siteUrl}/projects`,
  },
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <ProjectsShowcase />
      <Footer />
      <ThemeSwitcher variant="floating" />
    </main>
  );
}
