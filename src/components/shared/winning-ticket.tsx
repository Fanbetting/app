"use client";

import { ShineBorder } from "@/components/magicui/shine-border";
import addresses from "@/data/addresses.json";
import { FanbetLotteryClient } from "@/lib/contracts/FanbetLottery";
import { decodeWinningTicket } from "@/lib/utils/convert";
import { AlgorandClient } from "@algorandfoundation/algokit-utils/types/algorand-client";
import { NetworkId, useNetwork, useWallet } from "@txnlab/use-wallet-react";
import { useEffect, useState } from "react";

export default function WinningTicket() {
  const { algodClient, activeAddress, transactionSigner } = useWallet();
  const { activeNetwork } = useNetwork();
  const [winningTicket, setWinningTicket] = useState<number[]>([0, 0, 0, 0, 0]);

  useEffect(() => {
    const network = (
      activeNetwork == NetworkId.TESTNET
        ? "testnet"
        : activeNetwork == NetworkId.LOCALNET
          ? "localnet"
          : ""
    ) as keyof typeof addresses;

    (async () => {
      if (!activeAddress) return;

      const algorand = AlgorandClient.fromClients({ algod: algodClient });

      const lotteryClient = algorand.client.getTypedAppClientById(
        FanbetLotteryClient,
        {
          appId: BigInt(addresses[network].lotteryApp),
          defaultSender: activeAddress,
          defaultSigner: transactionSigner,
        },
      );

      const rawReveal = (
        await lotteryClient.state.global.reveal()
      )?.asByteArray();

      if (!rawReveal) return;

      const ticket = decodeWinningTicket(rawReveal);
      setWinningTicket(ticket);
    })();
  }, [algodClient, activeNetwork, activeAddress, transactionSigner]);

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
