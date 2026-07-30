"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, type HTMLMotionProps } from "framer-motion";

const MotionLink = motion.create(Link);

type NavAnchorProps = Omit<HTMLMotionProps<"a">, "href"> & { href: string };

const NavAnchor = ({ href, ...props }: NavAnchorProps) => {
  const pathname = usePathname();

  if (href.startsWith("#") && pathname === "/") {
    return <motion.a href={href} {...props} />;
  }

  const target = href.startsWith("#") ? `/${href}` : href;
  return <MotionLink href={target} {...props} />;
};

export default NavAnchor;
