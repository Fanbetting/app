"use client";

import {
  NetworkId,
  WalletId,
  WalletManager,
  WalletProvider as TxnWalletProvider,
} from "@txnlab/use-wallet-react";

interface Props {
  children: React.ReactNode;
}

export default function WalletProvider({ children }: Props) {
  const walletManager = new WalletManager({
    wallets: [
      WalletId.DEFLY,
      WalletId.PERA,
      {
        id: WalletId.LUTE,
        options: {
          siteName: "Fanbet Lottery",
        },
      },
    ],
    defaultNetwork: NetworkId.TESTNET,
  });

  return (
    <TxnWalletProvider manager={walletManager}>{children}</TxnWalletProvider>
  );
}
