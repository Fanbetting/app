"use client";

import addresses from "@/data/addresses.json";
import endpoints from "@/data/endpoints.json";
import { FanbetDiscounterClient } from "@/lib/contracts/FanbetDiscounter";
import { FanbetLotteryClient } from "@/lib/contracts/FanbetLottery";
import { FanbetPlayerClient } from "@/lib/contracts/FanbetPlayer";
import { FANBET_DOMAIN } from "@/lib/utils/constants";
import { ensureError } from "@/lib/utils/convert";
import { Ticket } from "@/lib/utils/ticket";
import { AlgorandClient } from "@algorandfoundation/algokit-utils/types/algorand-client";
import { AlgoAmount } from "@algorandfoundation/algokit-utils/types/amount";
import { NetworkId, useNetwork, useWallet } from "@txnlab/use-wallet-react";
import { decodeAddress } from "algosdk";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

export type GameStatus = "Open" | "Submission" | "Payout" | "Inactive";
export type Asset = "ALGO" | "FBET" | "USDC" | "IPT";

export type Holder = {
  legacy: boolean;
  regular: boolean;
};

type Account = {
  algorand?: AlgorandClient;
  asset?: Asset;
  lotteryClient?: FanbetLotteryClient;
  discountClient?: FanbetDiscounterClient;
  setAsset: Dispatch<SetStateAction<Asset | undefined>>;
  holder: Holder;
  players: number;
  prizePool: number;
  revealed: boolean;
  committed: boolean;
  gameStatus: GameStatus;
  algoBalance: number;
  assetBalance: number;
  tickets: Array<Ticket>;
  winningTicket: Ticket;
};

const AccountContext = createContext<Account>({
  setAsset: () => {},
  players: 0,
  tickets: [],
  prizePool: 0,
  gameStatus: "Inactive",
  algoBalance: 0,
  assetBalance: 0,
  revealed: false,
  committed: false,
  holder: {
    legacy: false,
    regular: false,
  },
  winningTicket: [0, 0, 0, 0, 0],
});

function AccountProvider({ children }: { children: React.ReactNode }) {
  const { activeNetwork } = useNetwork();
  const { transactionSigner, algodClient, activeAddress } = useWallet();

  const [asset, setAsset] = useState<Asset | undefined>();
  const [algoBalance, setAlgoBalance] = useState<number>(0);
  const [assetBalance, setAssetBalance] = useState<number>(0);
  const [tickets, setTickets] = useState<Array<Ticket>>([]);
  const [players, setPlayers] = useState<number>(0);
  const [prizePool, setPrizePool] = useState<number>(0);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [committed, setCommitted] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<GameStatus>("Inactive");

  const [algorand, setAlgorand] = useState<AlgorandClient>();
  const [lotteryClient, setLotteryClient] = useState<FanbetLotteryClient>();
  const [discountClient, setDiscountClient] =
    useState<FanbetDiscounterClient>();

  const [holder, setHolder] = useState<Holder>({
    legacy: false,
    regular: false,
  });

  const [winningTicket, setWinningTicket] = useState<Ticket>([0, 0, 0, 0, 0]);

  useEffect(() => {
    const asset = localStorage.getItem("selectedAsset") as Asset;
    if (asset) {
      setAsset(asset);
    }
  }, []);

  useEffect(() => {
    if (!asset) return;

    const network = (
      activeNetwork == NetworkId.TESTNET
        ? "testnet"
        : activeNetwork == NetworkId.LOCALNET
          ? "localnet"
          : activeNetwork == NetworkId.MAINNET
            ? "mainnet"
            : "testnet"
    ) as keyof typeof addresses;

    (async () => {
      try {
        if (!activeAddress) return;

        const algorand = AlgorandClient.fromClients({ algod: algodClient });

        const lotteryClient = algorand.client.getTypedAppClientById(
          FanbetLotteryClient,
          {
            appId: BigInt(addresses[network].lotteryApp[asset]),
            defaultSender: activeAddress,
            defaultSigner: transactionSigner,
          },
        );

        const discountClient = algorand.client.getTypedAppClientById(
          FanbetDiscounterClient,
          {
            appId: BigInt(addresses[network].discountApp),
            defaultSender: activeAddress,
            defaultSigner: transactionSigner,
          },
        );

        const assetId = await lotteryClient.state.global.ticketToken();

        if (!assetId) {
          throw new Error("Asset ID not found");
        }

        const { decimals: assetDecimals } =
          await algorand.asset.getById(assetId);

        const { balance: algoBalance } =
          await algorand.account.getInformation(activeAddress);

        const { balance: assetBalance } =
          await algorand.asset.getAccountInformation(activeAddress, assetId);

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
        ).asString() as "Open" | "Submission" | "Payout";

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

        await getElibility(
          activeNetwork,
          activeAddress,
          discountClient,
          setHolder,
        );

        setTickets(tickets);
        setPlayers(players);
        setGameStatus(gameStatus);
        setWinningTicket(winningTicket);
        setLotteryClient(lotteryClient);
        setDiscountClient(discountClient);

        setAlgorand(algorand);
        setAlgoBalance(algoBalance.algos);
        setRevealed(revealed === BigInt(1));
        setCommitted(committed === BigInt(1));
        setPrizePool(
          Number(lotteryAssets.balance / BigInt(10 ** assetDecimals)),
        );
        setAssetBalance(Number(assetBalance / BigInt(10 ** assetDecimals)));
      } catch (err) {
        const error = ensureError(err);
        console.error(error);
      }
    })();
  }, [activeAddress, activeNetwork, algodClient, asset, transactionSigner]);

  return (
    <AccountContext.Provider
      value={{
        algorand,
        asset,
        setAsset,
        tickets,
        players,
        prizePool,
        committed,
        holder,
        revealed,
        gameStatus,
        algoBalance,
        assetBalance,
        lotteryClient,
        discountClient,
        winningTicket,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export { AccountContext, AccountProvider };

async function getElibility(
  activeNetwork: string,
  activeAddress: string,
  discountClient: FanbetDiscounterClient,
  setHolder: (holder: Holder) => void,
) {
  const isLegacyHolder = await discountClient.isLegacyHolder({
    args: {
      holder: activeAddress,
    },
  });

  if (isLegacyHolder) {
    setHolder({ legacy: true, regular: false });
    return;
  }

  const nfdUrl =
    activeNetwork == NetworkId.MAINNET
      ? endpoints["mainnet"].nfdomains
      : endpoints["testnet"].nfdomains;

  const res = await fetch(`${nfdUrl}?owner=${activeAddress}`);
  const data = await res.json();

  if (data.total > 0) {
    for (const nfd of data.nfds) {
      if (String(nfd.name).endsWith(FANBET_DOMAIN)) {
        setHolder({ legacy: false, regular: true });
        return;
      }
    }
  }

  setHolder({ legacy: false, regular: false });
}
