import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { ProjectsShowcase } from "@/components/ProjectsShowcase";
import { personalInfo } from "@/lib/data";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: `Projects | ${personalInfo.name}`,
  description: `A complete collection of ${personalInfo.name}'s work — live products, in-progress builds, and private engagements.`,
  path: "/projects/",
});

const ProjectsPage = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <ProjectsShowcase />
      <Footer />
      <ThemeSwitcher variant="floating" />
    </main>
  );
};

export default ProjectsPage;
