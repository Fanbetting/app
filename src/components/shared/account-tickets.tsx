"use client";

import useAccount from "@/lib/hooks/use-account";
import { Ticket } from "@/lib/utils/ticket";

export default function AccountTickets() {
  const { tickets, winningTicket } = useAccount();
  if (!tickets) return null;

  tickets.forEach((ticket) => Number(ticket));

  return (
    <div className="grid gap-4">
      {tickets.map((ticket, i) => (
        <Row key={i} index={i + 1} ticket={ticket} solution={winningTicket} />
      ))}
    </div>
  );
}

interface RowProps {
  index: number;
  ticket: Ticket;
  solution: Ticket;
}

function Row({ ticket, solution, index }: RowProps) {
  const tiles = Array(5).fill(0);

  return (
    <div className="flex w-full items-center justify-evenly">
      <span className="text-sm font-medium text-gray-500">{index}</span>
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
  digit: number | bigint;
  status: "correct" | "present" | "absent" | "empty";
}

function Tile({ digit, status }: TileProps) {
  const className = `border-none w-10 h-10 md:h-20 md:w-20 lg-text-xl rounded-md flex items-center justify-center text-2xl font-bold ${
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
  guess: Ticket,
  solution: Ticket,
  index: number,
): "correct" | "present" | "absent" | "empty" {
  if (!guess[index]) return "empty";
  if (guess[index] === solution[index]) return "correct";
  if (solution.includes(guess[index])) return "present";

  return "absent";
}
