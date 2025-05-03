"use client";

import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useAccount from "@/lib/hooks/use-account";
import { useToast } from "@/lib/hooks/use-toast";
import { ensureError } from "@/lib/utils/convert";
import { Ticket } from "@/lib/utils/types";
import { AlgoAmount } from "@algorandfoundation/algokit-utils/types/amount";
import { useWallet } from "@txnlab/use-wallet-react";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

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
  const [loading, setLoading] = useState(false);
  const [won, setWon] = useState<boolean>(false);
  const {
    algorand,
    lotteryClient,
    algoLotteryClient,
    tickets,
    winningTicket,
    revealed,
    gameStatus,
  } = useAccount();
  const { activeAddress } = useWallet();
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

    if (matches[3] > 0 || matches[4] > 0 || matches[5] > 0) setWon(true);

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

    if (!algorand) {
      toast({
        title: "Something went wrong",
        description: "Algorand client not found",
        variant: "destructive",
      });
      return;
    }

    const client = algoLotteryClient || lotteryClient;
    if (!client) {
      toast({
        title: "Something went wrong",
        description: "Lottery client not found",
        variant: "destructive",
      });
      return;
    }

    if (!activeAddress) {
      toast({
        title: "Something went wrong",
        description: "Active address not found",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await client.send.submitTickets({
        args: {},
        validityWindow: 1000,
        maxFee: new AlgoAmount({ algos: 1 }),
        coverAppCallInnerTransactionFees: true,
        populateAppCallResources: true,
      });

      toast({
        title: "Ticket Submitted",
        description: `Transaction ID: ${result.txIds[0]}`,
      });
    } catch (err) {
      const error = ensureError(err);

      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClaimWinnings = async () => {
    setLoading(true);

    if (!algorand) {
      toast({
        title: "Something went wrong",
        description: "Algorand client not found",
        variant: "destructive",
      });
      return;
    }

    const client = algoLotteryClient || lotteryClient;
    if (!client) {
      toast({
        title: "Something went wrong",
        description: "Lottery client not found",
        variant: "destructive",
      });
      return;
    }

    if (!activeAddress) {
      toast({
        title: "Something went wrong",
        description: "Active address not found",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await client.send.payoutWinnings({
        args: {},
        validityWindow: 1000,
        maxFee: new AlgoAmount({ algos: 1 }),
        coverAppCallInnerTransactionFees: true,
        populateAppCallResources: true,
      });

      toast({
        title: "Claimed Rewards",
        description: `Transaction ID: ${result.txIds[0]}`,
      });
    } catch (err) {
      const error = ensureError(err);

      toast({
        title: "Something went wrong",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <ChartContainer config={chartConfig} className="">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="matches"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="tickets" fill="var(--color-tickets)" radius={4} />
        </BarChart>
      </ChartContainer>

      <div className="flex justify-end gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              disabled={!revealed || gameStatus != "Submission"}
            >
              {loading && gameStatus == "Submission" && (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              )}
              Submit Tickets
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Ready to enter your tickets?</AlertDialogTitle>
              <AlertDialogDescription>
                This submits your purchased lottery tickets to the smart
                contract. Please ensure you have tickets with three or more
                matching numbers, as only those are valid and eligible for a
                prize.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmitTickets}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="secondary"
              disabled={!revealed || gameStatus != "Payout"}
            >
              {loading && gameStatus == "Payout" && (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              )}
              Claim Winnings
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Claim your Winnings</AlertDialogTitle>
              <AlertDialogDescription>
                {won
                  ? "This will calculate your rewards and send them to your wallet. Proceed to claim your prize."
                  : "This transaction is not necessary as you do not have a winning ticket. Proceed anyway?"}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleClaimWinnings}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
