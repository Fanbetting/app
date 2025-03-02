"use client";

import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useAccount from "@/lib/hooks/use-account";
import { Ticket } from "@/lib/utils/ticket";
import { Ticket, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

type Matches = {
  "0": number;
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
};

export default function WinningsChart() {
  const { tickets, winningTicket, revealed } = useAccount();
  const [ticketMatches, setTicketMatches] = useState<Matches>({
    "0": 0,
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
  });

  useEffect(() => {
    if (!revealed) {
      return;
    }

    const matches = {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
    };

    const calcMatch = (ticket: Ticket) => {
      let matchCount = 0;

      for (let i = 0; i < ticket.length; i++) {
        if (Number(ticket[i]) === winningTicket[i]) {
          matchCount++;
        }
      }

      return matchCount.toString()
    };

    for (const ticket of tickets) {
        const matchCount = calcMatch(ticket) as keyof typeof matches;
        matches[matchCount] += 1;


    }

    console.log(matches);
    setTicketMatches(matches);
  }, [revealed, tickets, winningTicket]);

  const chartData = [
    { matches: "Zero Matches", tickets: ticketMatches["0"] },
    { matches: "One Match", tickets: ticketMatches["1"] },
    { matches: "Two Matches", tickets: ticketMatches["2"] },
    { matches: "Three Matches", tickets: ticketMatches["3"] },
    { matches: "Four Matches", tickets: ticketMatches["4"] },
    { matches: "Five Matches", tickets: ticketMatches["5"] },
  ];

  const chartConfig = {
    tickets: {
      label: "Tickets",
      color: "#6b7280"
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col gap-4">
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="matches"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {/* <Bar dataKey="tickets" fill="var(--color-tickets)" radius={4} /> */}
          <Bar dataKey="tickets" fill="var(--color-tickets)" radius={4} />
        </BarChart>
      </ChartContainer>

      <div className="flex justify-end gap-2">
        <Button variant="secondary" disabled={!revealed}>
          Submit Tickets
        </Button>
        <Button variant="default" disabled={!revealed}>
          Claim Winnings
        </Button>
      </div>
    </div>
  );
}
