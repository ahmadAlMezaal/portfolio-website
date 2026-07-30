import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Bookmarks } from "@/components/Bookmarks";
import { bookmarks, personalInfo } from "@/lib/data";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: `Bookmarks | ${personalInfo.name}`,
  description:
    "A filed collection of articles, repositories, packages and tools worth keeping — grouped by topic.",
  path: "/bookmarks/",
  image: "og-bookmarks.png",
});

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
