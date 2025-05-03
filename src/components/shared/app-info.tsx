"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useAccount from "@/lib/hooks/use-account";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Text } from "@/lib/styles/typography";
import { AlgoAmount } from "@algorandfoundation/algokit-utils/types/amount";
import { Lightbulb } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export default function AppInfo() {
  const { lotteryClient, algoLotteryClient, asset, algorand } = useAccount();
  const [price, setPrice] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (!(lotteryClient || algoLotteryClient) || !asset || !algorand) return;

    (async () => {
      if (asset === "ALGO" && algoLotteryClient) {
        const ticketPrice = await algoLotteryClient.state.global.ticketPrice();
        setPrice(AlgoAmount.MicroAlgos(ticketPrice!).valueOf());
        return;
      } else if (asset !== "ALGO" && lotteryClient) {
        const ticketPrice = await lotteryClient.state.global.ticketPrice();
        const ticketToken = await lotteryClient.state.global.ticketToken();

        const { decimals } = await algorand.asset.getById(ticketToken!);

        const lotteryPrice =
          Number(ticketPrice) / Math.pow(10, Number(decimals));

        setPrice(lotteryPrice);
      }
    })();
  }, [algoLotteryClient, algorand, asset, lotteryClient]);

  if (!price || !asset) {
    return;
  }

  return (
    <TooltipProvider>
      <Tooltip open={open}>
        <TooltipTrigger asChild>
          {isDesktop ? (
            <Button
              variant={"outline"}
              onClick={() => setOpen((prev) => !prev)}
            >
              <Lightbulb />
              How to Play?
            </Button>
          ) : (
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={() => setOpen((prev) => !prev)}
            >
              <Lightbulb />
            </Button>
          )}
        </TooltipTrigger>
        <TooltipContent
          align="start"
          onEscapeKeyDown={() => setOpen(false)}
          onPointerDownOutside={() => setOpen(false)}
        >
          <ol className="max-w-72 list-decimal text-wrap p-4 text-justify md:max-w-screen-sm lg:max-w-screen-md">
            <li>Connect your Algorand Wallet.</li>
            <li>Ensure your wallet contains ALGO, FBET, USDC, or IPT.</li>
            <li>
              Choose your tickets: either select a bulk quantity (easiest) or
              manually enter numbers (1-32).
            </li>
            <li>Confirm your purchase. Good luck!</li>
          </ol>
          <Separator className="my-2" />

          <Text variant="large">
            Ticket Price: {price} {asset}
          </Text>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
