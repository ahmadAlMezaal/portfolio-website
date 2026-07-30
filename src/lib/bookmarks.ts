import type { Bookmark, BookmarkFolder } from "@/types";

export const folderSlug = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const bookmarkHost = (url: string): string => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

export const bookmarkUrlLabel = (url: string): string =>
  url.replace(/^https?:\/\//, "").replace(/\/$/, "");

const matchesQuery = (bookmark: Bookmark, query: string): boolean =>
  [bookmark.title, bookmark.note ?? "", bookmark.kind, bookmarkHost(bookmark.url)]
    .join(" ")
    .toLowerCase()
    .includes(query);

export const filterFolders = (
  folders: BookmarkFolder[],
  query: string
): BookmarkFolder[] => {
  const needle = query.trim().toLowerCase();
  if (!needle) return folders;

  return folders
    .map((folder) =>
      folder.name.toLowerCase().includes(needle)
        ? folder
        : {
            ...folder,
            bookmarks: folder.bookmarks.filter((b) => matchesQuery(b, needle)),
          }
    )
    .filter((folder) => folder.bookmarks.length > 0);
};

export const countBookmarks = (folders: BookmarkFolder[]): number =>
  folders.reduce((total, folder) => total + folder.bookmarks.length, 0);
