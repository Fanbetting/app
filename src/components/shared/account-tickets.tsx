"use client";

import useAccount from "@/lib/hooks/use-account";

export default function AccountTickets() {
  const { tickets, winningTicket } = useAccount();
  if (!tickets) return null;

  return (
    <div className="grid gap-4">
      {tickets.map((guess, i) => (
        <Row key={i} ticket={guess} solution={winningTicket} />
      ))}
    </div>
  );
}

interface RowProps {
  ticket: number[];
  solution: number[];
}

function Row({ ticket, solution }: RowProps) {
  const tiles = Array(5).fill(0);

  return (
    <div className="flex w-full items-center justify-evenly">
      {tiles.map((_, i) => (
        <Tile
          key={i}
          digit={ticket[i]}
          status={getTileStatus(ticket, solution, i)}
        />
      ))}
    </div>
  );
}

interface TileProps {
  digit: number;
  status: "correct" | "present" | "absent" | "empty";
}

function Tile({ digit, status }: TileProps) {
  const className = `border-none w-14 h-14 lg:h-20 lg:w-20 lg-text-xl rounded-md flex items-center justify-center text-2xl font-bold ${
    status === "correct"
      ? "bg-green-500 text-white"
      : status === "present"
        ? "bg-yellow-500 text-white"
        : status === "absent"
          ? "bg-gray-500 text-white"
          : "border-gray-300"
  }`;

  return <div className={className}>{digit}</div>;
}

function getTileStatus(
  guess: number[],
  solution: number[],
  index: number,
): "correct" | "present" | "absent" | "empty" {
  if (!guess[index]) return "empty";
  if (guess[index] === solution[index]) return "correct";
  if (solution.includes(guess[index])) return "present";

  return "absent";
}
