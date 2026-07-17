"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, type HTMLMotionProps } from "framer-motion";

const MotionLink = motion.create(Link);

type NavAnchorProps = Omit<HTMLMotionProps<"a">, "href"> & { href: string };

// Hash links stay plain anchors on the home page (Lenis handles them) and
// navigate home first from other routes; route links use next/link so the
// GitHub Pages basePath is applied.
export default function NavAnchor({ href, ...props }: NavAnchorProps) {
  const pathname = usePathname();

  if (href.startsWith("#") && pathname === "/") {
    return <motion.a href={href} {...props} />;
  }

  const target = href.startsWith("#") ? `/${href}` : href;
  return <MotionLink href={target} {...props} />;
}
