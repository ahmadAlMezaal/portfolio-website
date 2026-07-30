import type { Metadata } from "next";
import Link from "next/link";
import { personalInfo } from "@/lib/data";

export const metadata: Metadata = {
  title: `404 | ${personalInfo.name}`,
  description: "That path does not exist.",
  alternates: {
    canonical: null,
  },
};

const NotFound = () => (
  <main className="min-h-screen flex items-center justify-center px-4 py-20">
    <div className="terminal-window w-full max-w-xl rounded-xl border border-gray-700 bg-gray-900/80 backdrop-blur-sm shadow-2xl overflow-hidden text-left">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700 bg-gray-800/60">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]/80" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]/80" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]/80" />
        <span className="ml-2 text-xs text-gray-400">
          {personalInfo.name.split(" ")[0].toLowerCase()}@portfolio: ~
        </span>
      </div>

      <div className="p-5 sm:p-7 space-y-2">
        <p className="text-sm sm:text-base">
          <span className="text-gray-500">$</span>{" "}
          <span className="text-purple-400">cd</span>{" "}
          <span className="text-gray-400">$REQUESTED_PATH</span>
        </p>
        <p className="text-sm sm:text-base text-gray-400">
          bash: cd: no such file or directory
        </p>

        <h1 className="text-5xl sm:text-7xl font-bold font-display tracking-tight py-4 theme-headline text-gradient">
          404
        </h1>

        <p className="text-sm sm:text-base text-gray-400">
          The page you asked for is not on this machine.
        </p>

        <p className="text-sm sm:text-base pt-4">
          <span className="text-gray-500">$</span>{" "}
          <Link
            href="/"
            className="text-purple-400 underline underline-offset-4 hover:text-gray-200 transition-colors"
          >
            cd ~
          </Link>
        </p>
      </div>
    </div>
  </main>
);

export default NotFound;
