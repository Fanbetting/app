import { ShineBorder } from "../magicui/shine-border";

export default function WinningTicket() {
  const winningTicket = [0, 0, 0, 0, 0];

  return (
    <ShineBorder
      className="flex h-fit items-center justify-center gap-4 overflow-hidden rounded-lg bg-transparent dark:bg-transparent md:shadow-xl"
      color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
    >
      {winningTicket.map((number, index) => (
        <div
          key={index}
          className="flex h-8 w-8 items-center justify-center rounded-full"
        >
          <span
            key={`${index}-${number}`}
            className="text-2xl font-bold text-foreground"
          >
            {number}
          </span>
        </div>
      ))}
    </ShineBorder>
  );
}
