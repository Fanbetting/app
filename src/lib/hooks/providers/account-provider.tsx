"use client";

import addresses from "@/data/addresses.json";
import { FanbetLotteryClient } from "@/lib/contracts/FanbetLottery";
import { FanbetPlayerClient } from "@/lib/contracts/FanbetPlayer";
import { FBET_DECIMALS } from "@/lib/utils/constants";
import { ensureError } from "@/lib/utils/convert";
import { Ticket } from "@/lib/utils/ticket";
import { AlgorandClient } from "@algorandfoundation/algokit-utils/types/algorand-client";
import { AlgoAmount } from "@algorandfoundation/algokit-utils/types/amount";
import { NetworkId, useNetwork, useWallet } from "@txnlab/use-wallet-react";
import { decodeAddress } from "algosdk";
import { createContext, useEffect, useState } from "react";

type Account = {
  players: number;
  prizePool: number;
  revealed: boolean;
  committed: boolean;
  gameStatus: string;
  algoBalance: number;
  fbetBalance: number;
  tickets: Array<Ticket>;
  winningTicket: Ticket;
};

const AccountContext = createContext<Account>({
  players: 0,
  tickets: [],
  prizePool: 0,
  gameStatus: "",
  algoBalance: 0,
  fbetBalance: 0,
  revealed: false,
  committed: false,
  winningTicket: [0, 0, 0, 0, 0],
});

function AccountProvider({ children }: { children: React.ReactNode }) {
  const { activeNetwork } = useNetwork();
  const { transactionSigner, algodClient, activeAddress } = useWallet();

  const [algoBalance, setAlgoBalance] = useState<number>(0);
  const [fbetBalance, setFbetBalance] = useState<number>(0);
  const [tickets, setTickets] = useState<Array<Ticket>>([]);
  const [players, setPlayers] = useState<number>(0);
  const [prizePool, setPrizePool] = useState<number>(0);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [committed, setCommitted] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<string>("");

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
          lotteryClient.appAddress,
          assetId,
        );

        const currentGameRound = await lotteryClient.state.global.gameRound();

        if (!currentGameRound) {
          throw new Error("Game round not found");
        }

        const gameRound = await lotteryClient.state.global.gameRound();
        const committed = await lotteryClient.state.global.committed();
        const revealed = await lotteryClient.state.global.revealed();

        const winningTicket =
          (await lotteryClient.getWinningTicket()) as Ticket;

        const gameStatus = (
          await lotteryClient.state.global.gameStatus()
        ).asString();

        const boxes = await lotteryClient.appClient.getBoxNames();

        let tickets: Ticket[] = [];

        const encoder = new TextEncoder();
        const playerBox = new Uint8Array([
          ...encoder.encode("p_"),
          ...decodeAddress(activeAddress).publicKey,
        ]);

        const present = boxes.some(
          (box) => box.nameRaw.toString() == playerBox.toString(),
        );

        if (present && gameRound) {
          const playerBoxValue =
            await lotteryClient.appClient.getBoxValue(playerBox);

          const playerDataview = new DataView(playerBoxValue.buffer);
          const playerAppID = BigInt(playerDataview.getBigUint64(0).toString());

          const playerClient = algorand.client.getTypedAppClientById(
            FanbetPlayerClient,
            {
              appId: playerAppID,
              appName: "FANBET PLAYER",
              defaultSender: activeAddress,
              defaultSigner: transactionSigner,
            },
          );

          const ticketsLength = await playerClient.getTicketsLength({
            args: {
              gameRound,
            },
          });

          let i = BigInt(0);

          while (i < ticketsLength) {
            const size = ticketsLength - i > 100 ? 100 : ticketsLength - i;

            const start = i;
            const stop = i + BigInt(size);

            const ticketPage = await playerClient.getTickets({
              args: {
                gameRound,
                start,
                stop,
              },
              staticFee: new AlgoAmount({ algos: 1 }),
            });

            tickets = tickets.concat(ticketPage);
            i += BigInt(size);
          }
        }

        const players = boxes.length;

        setPlayers(players);
        setGameStatus(gameStatus ?? "");
        setWinningTicket(winningTicket);
        setAlgoBalance(algoBalance.algos);
        setRevealed(revealed === BigInt(1));
        setCommitted(committed === BigInt(1));
        setPrizePool(Number(lotteryAssets.balance / FBET_DECIMALS));
        setFbetBalance(Number(accountAssets.balance / FBET_DECIMALS));
        setTickets(tickets);
      } catch (err) {
        const error = ensureError(err);
        console.error(error);
      }
    })();
  }, [activeAddress, activeNetwork, algodClient, transactionSigner]);

  return (
    <AccountContext.Provider
      value={{
        tickets,
        players,
        prizePool,
        committed,
        revealed,
        gameStatus,
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
