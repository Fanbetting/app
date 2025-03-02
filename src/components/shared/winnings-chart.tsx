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
import addresses from "@/data/addresses.json";
import { FanbetLotteryClient } from "@/lib/contracts/FanbetLottery";
import useAccount from "@/lib/hooks/use-account";
import { useToast } from "@/lib/hooks/use-toast";
import { ensureError } from "@/lib/utils/convert";
import { Ticket } from "@/lib/utils/ticket";
import { AlgorandClient } from "@algorandfoundation/algokit-utils/types/algorand-client";
import { NetworkId, useNetwork, useWallet } from "@txnlab/use-wallet-react";
import { LoaderCircle } from "lucide-react";
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
  const { toast } = useToast();
  const { activeNetwork } = useNetwork();
  const [loading, setLoading] = useState(false);
  const { tickets, winningTicket, revealed } = useAccount();
  const { algodClient, transactionSigner, activeAddress } = useWallet();
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

      return matchCount.toString();
    };

    for (const ticket of tickets) {
      const matchCount = calcMatch(ticket) as keyof typeof matches;
      matches[matchCount] += 1;
    }

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
      color: "#6b7280",
    },
  } satisfies ChartConfig;

  const handleSubmitTickets = async () => {
    setLoading(true);
    try {
      if (!activeAddress) {
        throw new Error("User wallet not connected");
      }

      const network = (
        activeNetwork == NetworkId.TESTNET
          ? "testnet"
          : activeNetwork == NetworkId.LOCALNET
            ? "localnet"
            : ""
      ) as keyof typeof addresses;

      const algorand = AlgorandClient.fromClients({
        algod: algodClient,
      }).setDefaultSigner(transactionSigner);

      const lotteryAppID = BigInt(addresses[network].lotteryApp);

      const lotteryClient = algorand.client.getTypedAppClientById(
        FanbetLotteryClient,
        {
          appId: lotteryAppID,
          defaultSender: activeAddress,
          defaultSigner: transactionSigner,
        },
      );

      const result = await lotteryClient.send.submitTickets({
        args: {},
        populateAppCallResources: true,
      });

      toast({
        title: "Ticket Submitted",
        description: `Transaction ID: ${result.txIds[0]}`,
      });
    } catch (err) {
      const error = ensureError(err);
      console.error(error);

      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClaimWinnings = async () => {
    setLoading(true);
    try {
      if (!activeAddress) {
        throw new Error("User wallet not connected");
      }

      const network = (
        activeNetwork == NetworkId.TESTNET
          ? "testnet"
          : activeNetwork == NetworkId.LOCALNET
            ? "localnet"
            : ""
      ) as keyof typeof addresses;

      const algorand = AlgorandClient.fromClients({
        algod: algodClient,
      }).setDefaultSigner(transactionSigner);

      const lotteryAppID = BigInt(addresses[network].lotteryApp);

      const lotteryClient = algorand.client.getTypedAppClientById(
        FanbetLotteryClient,
        {
          appId: lotteryAppID,
          defaultSender: activeAddress,
          defaultSigner: transactionSigner,
        },
      );

      const result = await lotteryClient.send.payoutWinnings({
        args: {},
        populateAppCallResources: true,
      });

      toast({
        title: "Claimed Rewards",
        description: `Transaction ID: ${result.txIds[0]}`,
      });
    } catch (err) {
      const error = ensureError(err);
      console.error(error);

      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
          <Bar dataKey="tickets" fill="var(--color-tickets)" radius={4} />
        </BarChart>
      </ChartContainer>

      <div className="flex justify-end gap-2">
        <Button
          variant="secondary"
          disabled={!revealed}
          onClick={handleSubmitTickets}
        >
          {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
          Submit Tickets
        </Button>
        <Button
          variant="default"
          disabled={!revealed}
          onClick={handleClaimWinnings}
        >
          {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
          Claim Winnings
        </Button>
      </div>
    </div>
  );
}
