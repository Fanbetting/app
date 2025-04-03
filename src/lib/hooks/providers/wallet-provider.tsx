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
      WalletId.PERA,
      WalletId.DEFLY,
      {
        id: WalletId.LUTE,
        options: {
          siteName: "Fanbet Lottery",
        },
      },
    ],
    defaultNetwork: NetworkId.MAINNET,
  });

  return (
    <TxnWalletProvider manager={walletManager}>{children}</TxnWalletProvider>
  );
}
