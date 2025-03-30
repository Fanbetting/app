"use client";

import useAccount from "@/lib/hooks/use-account";
import { cn } from "@/lib/utils";

export default function GameStatus({ className }: { className?: string }) {
  const { gameStatus } = useAccount();

  return (
    <div
      className={cn(
        `inline-flex h-9 items-center justify-center rounded-md border px-2 py-1 text-xs sm:h-9 sm:px-4 sm:py-2 sm:text-sm`,
        className,
      )}
    >
      <div className="flex items-center justify-center gap-1 sm:gap-2">
        <div
          className={`h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2 ${
            gameStatus === "Open"
              ? "bg-green-500"
              : gameStatus === "Submission"
                ? "bg-yellow-500"
                : gameStatus === "Payout"
                  ? "bg-orange-500"
                  : "bg-gray-500"
          }`}
        />
        {gameStatus}
      </div>
    </div>
  );
}
