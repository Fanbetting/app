"use client";

import { ShineBorder } from "@/components/magicui/shine-border";
import addresses from "@/data/addresses.json";
import { FanbetLotteryClient } from "@/lib/contracts/FanbetLottery";
import { decodeWinningTicket } from "@/lib/utils/convert";
import { NetworkId, useWallet } from "@txnlab/use-wallet-react";
import { useEffect, useState } from "react";

export default function WinningTicket() {
  const { algodClient, activeAccount, activeNetwork } = useWallet();
  const [winningTicket, setWinningTicket] = useState<number[]>([]);

  useEffect(() => {
    const network = (
      activeNetwork == NetworkId.TESTNET
        ? "testnet"
        : activeNetwork == NetworkId.LOCALNET
          ? "localnet"
          : ""
    ) as keyof typeof addresses;

    (async () => {
      if (!activeAccount) return;

      const lotteryClient = new FanbetLotteryClient(
        {
          resolveBy: "id",
          id: addresses[network].lotteryApp,
          sender: activeAccount,
        },
        algodClient,
      );

      const globalState = await lotteryClient.getGlobalState();
      const response = globalState.reveal?.asByteArray();

      if (!response) return;

      const ticket = decodeWinningTicket(response);
      setWinningTicket(ticket);
    })();
  }, [algodClient, activeAccount, activeNetwork]);

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
