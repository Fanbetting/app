"use client";

import addresses from "@/data/addresses.json";
import { FanbetLotteryClient } from "@/lib/contracts/FanbetLottery";
import { FBET_DECIMALS } from "@/lib/utils/constants";
import { ensureError } from "@/lib/utils/convert";
import { AlgorandClient } from "@algorandfoundation/algokit-utils/types/algorand-client";
import { NetworkId, useNetwork, useWallet } from "@txnlab/use-wallet-react";
import { createContext, useEffect, useState } from "react";

import { useToast } from "../use-toast";

type Account = {
  players: number;
  prizePool: number;
  algoBalance: number;
  fbetBalance: number;
  tickets: Array<number>;
};

const AccountContext = createContext<Account | undefined>(undefined);

function AccountProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const { activeNetwork } = useNetwork();
  const { algodClient, activeAddress, transactionSigner } = useWallet();

  const [algoBalance, setAlgoBalance] = useState<number>(0);
  const [fbetBalance, setFbetBalance] = useState<number>(0);
  const [tickets, setTickets] = useState<Array<number>>(
    Array.from([0, 0, 0, 0, 0]),
  );
  const [players, setPlayers] = useState<number>(0);
  const [prizePool, setPrizePool] = useState<number>(0);

  useEffect(() => {
    const network = (
      activeNetwork == NetworkId.TESTNET
        ? "testnet"
        : activeNetwork == NetworkId.LOCALNET
          ? "localnet"
          : ""
    ) as keyof typeof addresses;

    (async () => {
      try {
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

        const assetId = await lotteryClient.state.global.purchaseToken();

        if (!assetId) {
          throw new Error("Asset ID not found");
        }

        const accountInfo =
          await algorand.account.getInformation(activeAddress);
        const algoBalance = accountInfo.balance;

        const accountAssets = await algorand.asset.getAccountInformation(
          activeAddress,
          assetId,
        );

        const lotteryAssets = await algorand.asset.getAccountInformation(
          addresses[network].lotteryAddress,
          assetId,
        );

        const players = (await lotteryClient.appClient.getBoxNames()).length;

        setPlayers(players);
        setAlgoBalance(algoBalance.algos);
        setFbetBalance(Number(accountAssets.balance / FBET_DECIMALS));
        setPrizePool(Number(lotteryAssets.balance / FBET_DECIMALS));
      } catch (err) {
        const error = ensureError(err);
        console.error(error);

        setPlayers(0);
        setPrizePool(0);
        setAlgoBalance(0);
        setFbetBalance(0);
      }
    })();
  }, [algodClient, activeAddress, activeNetwork, transactionSigner, toast]);

  return (
    <AccountContext.Provider
      value={{
        tickets,
        players,
        prizePool,
        algoBalance,
        fbetBalance,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export { AccountContext, AccountProvider };
