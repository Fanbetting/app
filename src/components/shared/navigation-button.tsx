"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "../ui/button";

interface RainbowProps {
  variant:
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | null
  | undefined;
  path: string;
  children: React.ReactNode;
}

export function NavigationButton({ path, children, variant }: RainbowProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setIsLoading(() => true);
    router.push(path);
    setIsLoading(() => false);
  };

  return (
    <Button variant={variant} onClick={handleClick}>
      {isLoading ? "Loading..." : children}
    </Button>
  );
}
