"use client";

import { Text } from "@/lib/styles/typography";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function Footer() {
  const { resolvedTheme } = useTheme();

  return (
    <footer className="flex h-16 items-center justify-center">
      <span className="flex items-center gap-2">
        <Text variant="muted">Powered by</Text>
        {resolvedTheme === "dark" ? (
          <Image
            src="/algorand_light.png"
            alt="Algorand"
            width={100}
            height={100}
          />
        ) : (
          <Image
            src="/algorand_dark.png"
            alt="Algorand"
            width={100}
            height={100}
          />
        )}
      </span>
    </footer>
  );
}
