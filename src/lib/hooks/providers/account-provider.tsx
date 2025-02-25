"use client";

import addresses from "@/data/addresses.json";
import { FanbetLotteryClient } from "@/lib/contracts/FanbetLottery";
import { FBET_DECIMALS } from "@/lib/utils/constants";
import { AlgorandClient } from "@algorandfoundation/algokit-utils/types/algorand-client";
import { NetworkId, useNetwork, useWallet } from "@txnlab/use-wallet-react";
import { createContext, useEffect, useState } from "react";

type Account = {
  algoBalance: number;
  fbetBalance: number;
  tickets: Array<number>;
};

const AccountContext = createContext<Account | undefined>(undefined);

function AccountProvider({ children }: { children: React.ReactNode }) {
  const { activeNetwork } = useNetwork();
  const { algodClient, activeAccount, activeAddress, transactionSigner } =
    useWallet();

  const [algoBalance, setAlgoBalance] = useState<number>(0);
  const [fbetBalance, setFbetBalance] = useState<number>(0);

  useEffect(() => {
    const network = (
      activeNetwork == NetworkId.TESTNET
        ? "testnet"
        : activeNetwork == NetworkId.LOCALNET
          ? "localnet"
          : ""
    ) as keyof typeof addresses;

    (async () => {
      if (!activeAddress || !activeAccount) return;
      const algorand = AlgorandClient.fromClients({ algod: algodClient });

      const lotteryClient = algorand.client.getTypedAppClientById(
        FanbetLotteryClient,
        {
          appId: BigInt(addresses[network].lotteryApp),
          defaultSender: activeAddress,
          defaultSigner: transactionSigner,
        },
      );

      const accountInfo = await algorand.account.getInformation(activeAddress);
      const algoBalance = accountInfo.balance;

      setAlgoBalance(algoBalance.algos);

      const assetId = await lotteryClient.state.global.purchaseToken();

      if (!assetId) {
        setFbetBalance(0);
        return;
      }

      const accountAssets = await algorand.asset.getAccountInformation(
        activeAddress,
        assetId,
      );

      if (!accountAssets) {
        setFbetBalance(0);
        return;
      }

      const fbetBalance = Number(accountAssets.balance) / FBET_DECIMALS;
      setFbetBalance(fbetBalance);
    })();
  }, [
    algodClient,
    activeAccount,
    activeAddress,
    activeNetwork,
    transactionSigner,
  ]);

  return (
    <AccountContext.Provider
      value={{
        algoBalance,
        fbetBalance,
        tickets: Array.from([0, 0, 0, 0, 0]),
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export { AccountContext, AccountProvider };
