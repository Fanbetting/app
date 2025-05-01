"use client";

import { Text } from "@/lib/styles/typography";
import { BookOpen } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

import { Button } from "../ui/button";

export default function Footer() {
  const { resolvedTheme } = useTheme();

  return (
    <footer className="flex flex-col items-center justify-center py-4">
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

      <span className="flex items-center">
        <Button asChild className="text-muted-foreground" variant="link">
          <Link
            href="https://docs.fanbetting.xyz"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BookOpen /> Read the docs here.
          </Link>
        </Button>
      </span>
    </footer>
  );
}
