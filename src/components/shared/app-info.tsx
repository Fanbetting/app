"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useAccount from "@/lib/hooks/use-account";
import { Text } from "@/lib/styles/typography";
import { Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "../ui/button";

export default function AppInfo() {
  const { lotteryClient, asset, algorand } = useAccount();
  const [price, setPrice] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!lotteryClient || !asset || !algorand) return;

    (async () => {
      const ticketPrice = await lotteryClient.state.global.ticketPrice();
      const ticketToken = await lotteryClient.state.global.ticketToken();

      if (!ticketPrice) {
        throw new Error("Invalid Ticket Price");
      }

      if (!ticketToken) {
        throw new Error("Invalid Ticket Token");
      }

      const { decimals } = await algorand.asset.getById(ticketToken);
      const lotteryPrice = Number(ticketPrice) / Math.pow(10, Number(decimals));

      setPrice(lotteryPrice);
    })();
  }, [algorand, asset, lotteryClient]);

  if (!price || !asset) {
    return;
  }

  return (
    <TooltipProvider>
      <Tooltip open={open}>
        <TooltipTrigger asChild>
          <Button variant={"outline"} onClick={() => setOpen((prev) => !prev)}>
            <Lightbulb />
            How to Play?
          </Button>
        </TooltipTrigger>
        <TooltipContent className="w-full">
          <ol className="max-w-full list-decimal p-4 text-left">
            <li>
              <Text variant="muted">Connect your Algorand Wallet.</Text>
            </li>

            <li>
              <Text variant="muted">
                Fund your wallet with ALGO, $FBET, $USDC, or $IPT.
              </Text>
            </li>

            <li>
              <Text variant="muted">
                Select how many tickets you’d like to buy in bulk purchase
                (easiest) OR type numbers manually from (1 to 32) if you want to
                choose.
              </Text>
            </li>

            <li>
              <Text variant="muted">
                Confirm Purchase and then just wait and see if you win!
              </Text>
            </li>
          </ol>

          <Text variant="large">
            Ticket Price: {price} {asset}
          </Text>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
