"use client";

import useAccount from "@/lib/hooks/use-account";

export default function GameStatus() {
  const { gameStatus } = useAccount();

  return (
    <div
      className={`inline-flex h-9 items-center justify-center rounded-md border px-4 py-2`}
    >
      <div className="flex items-center justify-center gap-2">
        <div
          className={`h-2 w-2 rounded-full ${
            gameStatus === "Open"
              ? "bg-green-500"
              : gameStatus === "Submission"
                ? "bg-yellow-500"
                : gameStatus === "Payout"
                  ? "bg-orange-500"
                  : "bg-gray-500"
          }`}
        />
        Lottery Status: {gameStatus}
      </div>
    </div>
  );
}
