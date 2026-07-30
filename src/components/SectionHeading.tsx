"use client";

import { DecodeText } from "./DecodeText";

type Props = {
  title: string;
  subtitle?: string;
  as?: "h1" | "h2";
  cycle?: 1 | 2 | 3;
};

export const SectionHeading = ({
  title,
  subtitle,
  as: Tag = "h2",
  cycle = 1,
}: Props) => {
  return (
    <>
      <Tag className="text-4xl sm:text-5xl font-bold mb-4">
        <DecodeText
          className={`glitch-text glitch-idle glitch-delay-${cycle} inline-block text-gradient`}
          text={title}
          trigger="view"
        />
      </Tag>
      {subtitle && (
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </>
  );
};
