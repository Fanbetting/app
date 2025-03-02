"use client";

import addresses from "@/data/addresses.json";
import { FanbetLotteryClient } from "@/lib/contracts/FanbetLottery";
import { FBET_DECIMALS } from "@/lib/utils/constants";
import {
  decodePlayerInfo,
  decodeWinningTicket,
  ensureError,
} from "@/lib/utils/convert";
import { Ticket } from "@/lib/utils/ticket";
import { AlgorandClient } from "@algorandfoundation/algokit-utils/types/algorand-client";
import { NetworkId, useNetwork, useWallet } from "@txnlab/use-wallet-react";
import { decodeAddress } from "algosdk";
import { createContext, useEffect, useState } from "react";

import { useToast } from "../use-toast";

type Account = {
  players: number;
  prizePool: number;
  revealed: boolean;
  committed: boolean;
  algoBalance: number;
  fbetBalance: number;
  tickets: Array<Ticket>;
  winningTicket: Ticket;
};

const AccountContext = createContext<Account>({
  players: 0,
  tickets: [],
  prizePool: 0,
  algoBalance: 0,
  fbetBalance: 0,
  revealed: false,
  committed: false,
  winningTicket: [0, 0, 0, 0, 0],
});

function AccountProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const { activeNetwork } = useNetwork();
  const { algodClient, activeAddress, transactionSigner } = useWallet();

  const [algoBalance, setAlgoBalance] = useState<number>(0);
  const [fbetBalance, setFbetBalance] = useState<number>(0);
  const [tickets, setTickets] = useState<Array<Ticket>>([]);
  const [players, setPlayers] = useState<number>(0);
  const [prizePool, setPrizePool] = useState<number>(0);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [committed, setCommitted] = useState<boolean>(false);

  const [winningTicket, setWinningTicket] = useState<Ticket>([0, 0, 0, 0, 0]);

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

        const assetId = await lotteryClient.state.global.ticketToken();

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

        const currentGameRound = await lotteryClient.state.global.gameRound();

        if (!currentGameRound) {
          throw new Error("Game round not found");
        }

        const committed = await lotteryClient.state.global.committed();
        const revealed = await lotteryClient.state.global.revealed();

        setCommitted(committed === BigInt(1));
        setRevealed(revealed === BigInt(1));

        const rawReveal = (
          await lotteryClient.state.global.reveal()
        )?.asByteArray();

        if (rawReveal) {
          const ticket = decodeWinningTicket(rawReveal);
          setWinningTicket(ticket);
        }

        const encoder = new TextEncoder();
        const playerBoxName = new Uint8Array([
          ...encoder.encode("p_"),
          ...decodeAddress(activeAddress).publicKey,
        ]);

        const boxNames = await lotteryClient.appClient.getBoxNames();

        const present = boxNames.some(
          (boxName) => boxName.nameRaw.toString() === playerBoxName.toString(),
        );

        if (present) {
          const playerInfo =
            await lotteryClient.appClient.getBoxValue(playerBoxName);
          const { ticketsRound, tickets } = decodePlayerInfo(playerInfo);

          if (ticketsRound === currentGameRound) {
            setTickets(tickets);
          }
        }

        const players = boxNames.length;

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
        committed,
        revealed,
        algoBalance,
        fbetBalance,
        winningTicket,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export { AccountContext, AccountProvider };
