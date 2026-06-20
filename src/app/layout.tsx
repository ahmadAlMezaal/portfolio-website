import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import MatrixRain from "@/components/MatrixRain";
import ScrollToTopRocket from "@/components/ScrollToTopRocket";
import JsonLd from "@/components/JsonLd";
import { siteMetadata, personalInfo } from "@/lib/data";
import { getBasePath } from "@/lib/utils";

const siteUrl = "https://theaam.dev";

// Single typeface for the whole site — a developer/terminal monospace.
const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const basePath = getBasePath();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteMetadata.title,
  description: siteMetadata.description,
  keywords: siteMetadata.keywords,
  authors: [{ name: personalInfo.name }],
  creator: personalInfo.name,
  publisher: personalInfo.name,
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: `${basePath}/icon.svg`, sizes: "any" },
      { url: `${basePath}/icon.svg`, type: "image/svg+xml" },
    ],
    shortcut: `${basePath}/icon.svg`,
    apple: `${basePath}/icon.svg`,
  },
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    type: "website",
    locale: siteMetadata.locale,
    url: siteUrl,
    siteName: personalInfo.name,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${personalInfo.name} - ${personalInfo.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.description,
    creator: "@ahmadalmezaal",
    images: [`${siteUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here after setup
    // google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${jetBrainsMono.variable}`}>
      <body className="font-mono antialiased">
        <SmoothScroll>
          {/* Global terminal code-rain backdrop, fixed behind all content */}
          <MatrixRain />
          <JsonLd url={siteUrl} />
          {children}
          <ScrollToTopRocket />
        </SmoothScroll>
      </body>
    </html>
  );
}
