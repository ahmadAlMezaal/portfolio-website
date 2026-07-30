import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import type { PortfolioConfig } from "../src/types/index.ts";

const WIDTH = 1200;
const HEIGHT = 630;

const BACKGROUND = "#050806";
const PANEL = "#04120c";
const BORDER = "rgba(34, 197, 94, 0.28)";
const RULE = "rgba(34, 197, 94, 0.18)";
const DIM = "#5f7d6e";
const GREEN = "#22c55e";
const BRIGHT = "#4ade80";
const PALE = "#e6f5ec";

const GLYPHS = "01アイウエオカキクケコサシスセソタチツテトナニヌネノ$#{}[]<>/\\*+=";

const dataPath = resolve("src/lib/portfolio-data.json");
const raw: PortfolioConfig | null = existsSync(dataPath)
  ? JSON.parse(readFileSync(dataPath, "utf8"))
  : null;

if (!raw) {
  console.error(
    "No synced portfolio data found. Set PORTFOLIO_DATA_URL (and PORTFOLIO_DATA_TOKEN) and run: node scripts/sync-data.ts"
  );
  process.exit(1);
}

const fontFile = (weight: number) =>
  readFileSync(
    resolve(`node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-${weight}-normal.woff`)
  );

const host = raw.siteMetadata.siteUrl.replace(/^https?:\/\//, "");
const handle = raw.personalInfo.name.split(" ")[0].toLowerCase();

const nextRandom = (seed: number) => {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
};

const rainColumns = () => {
  const random = nextRandom(20260730);
  const columns = [];
  for (let column = 0; column < 26; column += 1) {
    const cells = [];
    const length = 8 + Math.floor(random() * 7);
    for (let cell = 0; cell < length; cell += 1) {
      cells.push({
        type: "div",
        props: {
          style: {
            display: "flex",
            height: 34,
            color: GREEN,
            opacity: 0.05 + random() * 0.09,
          },
          children: GLYPHS[Math.floor(random() * GLYPHS.length)],
        },
      });
    }
    columns.push({
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 46,
          paddingTop: Math.floor(random() * 120),
        },
        children: cells,
      },
    });
  }
  return columns;
};

const chip = (label: string) => ({
  type: "div",
  props: {
    style: {
      display: "flex",
      border: `1px solid rgba(34, 197, 94, 0.45)`,
      borderRadius: 999,
      padding: "8px 20px",
      fontSize: 20,
      color: BRIGHT,
    },
    children: label,
  },
});

type Card = {
  file: string;
  command: string;
  heading: string;
  subtitle: string;
  chips: string[];
};

const card = ({ command, heading, subtitle, chips }: Card) => ({
  type: "div",
  props: {
    style: {
      width: "100%",
      height: "100%",
      display: "flex",
      position: "relative",
      background: BACKGROUND,
      fontFamily: "JetBrains Mono",
    },
    children: [
      {
        type: "div",
        props: {
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            width: WIDTH,
            height: HEIGHT,
            display: "flex",
            fontSize: 26,
          },
          children: rainColumns(),
        },
      },
      {
        type: "div",
        props: {
          style: {
            position: "absolute",
            top: 115,
            left: 100,
            width: 1000,
            display: "flex",
            flexDirection: "column",
            borderRadius: 14,
            border: `1px solid ${BORDER}`,
            background: PANEL,
          },
          children: [
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  alignItems: "center",
                  height: 58,
                  padding: "0 22px",
                  borderBottom: `1px solid ${RULE}`,
                },
                children: [
                  ...["#ff5f57", "#febc2e", "#28c840"].map((colour) => ({
                    type: "div",
                    props: {
                      style: {
                        width: 14,
                        height: 14,
                        borderRadius: 999,
                        background: colour,
                        marginRight: 9,
                      },
                    },
                  })),
                  {
                    type: "div",
                    props: {
                      style: { marginLeft: 14, fontSize: 19, color: DIM },
                      children: `~ ${handle}@${host} — zsh`,
                    },
                  },
                ],
              },
            },
            {
              type: "div",
              props: {
                style: { display: "flex", flexDirection: "column", padding: "38px 48px 44px" },
                children: [
                  {
                    type: "div",
                    props: {
                      style: { display: "flex", fontSize: 24 },
                      children: [
                        { type: "div", props: { style: { color: DIM, marginRight: 12 }, children: "$" } },
                        { type: "div", props: { style: { color: BRIGHT }, children: command } },
                      ],
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: { display: "flex", alignItems: "center", marginTop: 18 },
                      children: [
                        {
                          type: "div",
                          props: {
                            style: { fontSize: 64, fontWeight: 800, color: PALE, letterSpacing: -1 },
                            children: heading,
                          },
                        },
                        {
                          type: "div",
                          props: {
                            style: {
                              width: 20,
                              height: 52,
                              marginLeft: 14,
                              background: BRIGHT,
                            },
                          },
                        },
                      ],
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: { marginTop: 16, fontSize: 27, color: GREEN },
                      children: subtitle,
                    },
                  },
                  chips.length > 0
                    ? {
                        type: "div",
                        props: {
                          style: { display: "flex", marginTop: 30, gap: 14 },
                          children: chips.map(chip),
                        },
                      }
                    : { type: "div", props: { style: { display: "flex" } } },
                ],
              },
            },
          ],
        },
      },
      {
        type: "div",
        props: {
          style: {
            position: "absolute",
            right: 52,
            bottom: 38,
            display: "flex",
            fontSize: 23,
            fontWeight: 700,
            color: GREEN,
          },
          children: host,
        },
      },
    ],
  },
});

const unique = (values: string[]) => [...new Set(values)];

const CARDS: Card[] = [
  {
    file: "og-projects.png",
    command: "ls ~/projects",
    heading: "Projects",
    subtitle: "Live products, in-progress builds, private work.",
    chips: unique(raw.projects.filter((p) => p.featured).flatMap((p) => p.tags)).slice(0, 5),
  },
  {
    file: "og-learnings.png",
    command: "cat ~/field-notes",
    heading: "Field Notes",
    subtitle: "Patterns, laws and paradigms from production.",
    chips: unique((raw.learnings ?? []).map((l) => l.category)).slice(0, 5),
  },
  {
    file: "og-bookmarks.png",
    command: "ls ~/bookmarks",
    heading: "Bookmarks",
    subtitle: "Articles, repositories and tools worth keeping.",
    chips: (raw.bookmarks ?? []).map((folder) => folder.name).slice(0, 5),
  },
];

const fonts = [
  { name: "JetBrains Mono", data: fontFile(400), weight: 400 as const, style: "normal" as const },
  { name: "JetBrains Mono", data: fontFile(700), weight: 700 as const, style: "normal" as const },
  { name: "JetBrains Mono", data: fontFile(800), weight: 800 as const, style: "normal" as const },
];

for (const entry of CARDS) {
  const svg = await satori(card(entry) as Parameters<typeof satori>[0], {
    width: WIDTH,
    height: HEIGHT,
    fonts,
  });
  const png = new Resvg(svg).render().asPng();
  const outputPath = resolve("public", entry.file);
  writeFileSync(outputPath, png);
  console.log(`✓ ${entry.file} (${Math.round(png.length / 1024)} KB)`);
}
