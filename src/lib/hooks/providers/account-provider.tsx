"use client";

import {
  ALGO_DECIMALS,
  FBET_ASSET_ID,
  FBET_DECIMALS,
} from "@/lib/utils/constants";
import { useWallet } from "@txnlab/use-wallet-react";
import { createContext, useEffect, useState } from "react";

type Account = {
  algoBalance: number;
  fbetBalance: number;
  tickets: Array<number>;
};

const AccountContext = createContext<Account | undefined>(undefined);

function AccountProvider({ children }: { children: React.ReactNode }) {
  const { algodClient, activeAddress, activeNetwork } = useWallet();

  const [algoBalance, setAlgoBalance] = useState<number>(0);
  const [fbetBalance, setFbetBalance] = useState<number>(0);

  useEffect(() => {
    if (!activeAddress) return;

    (async () => {
      const accountInfo = await algodClient
        .accountInformation(activeAddress)
        .do();

      const algoAmount = accountInfo["amount"] ?? 0;
      setAlgoBalance(algoAmount != 0 ? algoAmount / ALGO_DECIMALS : 0);

      const fbetAmount =
        (accountInfo["assets"].length &&
          accountInfo["assets"].find(
            (asset: { "asset-id": number }) =>
              asset["asset-id"] == FBET_ASSET_ID,
          ).amount) ??
        0;

      setFbetBalance(fbetAmount != 0 ? fbetAmount / FBET_DECIMALS : 0);
    })();
  }, [activeAddress, activeNetwork, algodClient]);

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
