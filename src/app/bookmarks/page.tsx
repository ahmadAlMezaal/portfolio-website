import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Bookmarks } from "@/components/Bookmarks";
import { bookmarks, personalInfo, siteMetadata } from "@/lib/data";

export const metadata: Metadata = {
  title: `Bookmarks | ${personalInfo.name}`,
  description:
    "A filed collection of articles, repositories, packages and tools worth keeping — grouped by topic.",
  alternates: {
    canonical: `${siteMetadata.siteUrl}/bookmarks`,
  },
};

const BookmarksPage = () => (
  <main className="min-h-screen">
    <Navbar />
    <Bookmarks
      folders={bookmarks}
      owner={personalInfo.name.split(" ")[0].toLowerCase()}
    />
    <Footer />
    <ThemeSwitcher variant="floating" />
  </main>
);

export default BookmarksPage;
