"use client";

import addresses from "@/data/addresses.json";
import endpoints from "@/data/endpoints.json";
import { FanbetAlgoLotteryClient } from "@/lib/contracts/FanbetAlgoLottery";
import { FanbetDiscounterClient } from "@/lib/contracts/FanbetDiscounter";
import { FanbetLotteryClient } from "@/lib/contracts/FanbetLottery";
import { FanbetPlayerClient } from "@/lib/contracts/FanbetPlayer";
import { FANBET_DOMAIN } from "@/lib/utils/constants";
import { ensureError } from "@/lib/utils/convert";
import { Asset, Holder, GameStatus, Ticket } from "@/lib/utils/types";
import { AlgorandClient } from "@algorandfoundation/algokit-utils/types/algorand-client";
import { AlgoAmount } from "@algorandfoundation/algokit-utils/types/amount";
import { NetworkId, useNetwork, useWallet } from "@txnlab/use-wallet-react";
import { decodeAddress, Transaction } from "algosdk";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useRef,
} from "react";

type Account = {
  asset?: Asset;
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
  algorand?: AlgorandClient;
  lotteryClient?: FanbetLotteryClient;
  discountClient?: FanbetDiscounterClient;
  algoLotteryClient?: FanbetAlgoLotteryClient;
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
  const [algoLotteryClient, setAlgoLotteryClient] =
    useState<FanbetAlgoLotteryClient>();
  const [discountClient, setDiscountClient] =
    useState<FanbetDiscounterClient>();

  const [holder, setHolder] = useState<Holder>({
    legacy: false,
    regular: false,
  });

  const [winningTicket, setWinningTicket] = useState<Ticket>([0, 0, 0, 0, 0]);

  const dataLoadedRef = useRef<{
    address?: string;
    network?: string;
    asset?: Asset;
  }>({});

  useEffect(() => {
    const savedAsset = localStorage.getItem("selectedAsset") as Asset;
    if (savedAsset) {
      setAsset(savedAsset);
    }
  }, []);

  useEffect(() => {
    if (!asset || !activeAddress || !algodClient || !transactionSigner) return;

    const currentDataKey = `${activeAddress}-${activeNetwork}-${asset}`;
    const lastDataKey = `${dataLoadedRef.current.address}-${dataLoadedRef.current.network}-${dataLoadedRef.current.asset}`;

    if (currentDataKey === lastDataKey) return;

    dataLoadedRef.current = {
      address: activeAddress,
      network: activeNetwork,
      asset: asset,
    };

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
        const algorand = AlgorandClient.fromClients({ algod: algodClient });
        setAlgorand(algorand);

        const { balance } =
          await algorand.account.getInformation(activeAddress);
        setAlgoBalance(balance.algos);

        const discountClient = algorand.client.getTypedAppClientById(
          FanbetDiscounterClient,
          {
            appId: BigInt(addresses[network].discountApp),
            defaultSender: activeAddress,
            defaultSigner: transactionSigner,
          },
        );
        setDiscountClient(discountClient);

        await getElibility(
          activeNetwork,
          activeAddress,
          discountClient,
          setHolder,
        );

        if (asset == "ALGO") {
          const algoLotteryClient = algorand.client.getTypedAppClientById(
            FanbetAlgoLotteryClient,
            {
              appId: BigInt(addresses[network].lotteryApp[asset]),
              defaultSender: activeAddress,
              defaultSigner: transactionSigner,
            },
          );
          setAlgoLotteryClient(algoLotteryClient);

          const {
            gameRound,
            gameStatus,
            winningTicket,
            committed,
            revealed,
            prizePool,
          } = await getLotteryState(algoLotteryClient);
          setPrizePool(AlgoAmount.MicroAlgos(prizePool!).valueOf());
          setCommitted(committed === BigInt(1));
          setRevealed(revealed === BigInt(1));
          setWinningTicket(winningTicket);
          setGameStatus(gameStatus);

          const { tickets, players } = await getTickets({
            lotteryClient: algoLotteryClient,
            playerAddress: activeAddress,
            gameRound: gameRound!,
            transactionSigner,
            algorand,
          });

          setTickets(tickets);
          setPlayers(players);

          return;
        }

        const lotteryClient = algorand.client.getTypedAppClientById(
          FanbetLotteryClient,
          {
            appId: BigInt(addresses[network].lotteryApp[asset]),
            defaultSender: activeAddress,
            defaultSigner: transactionSigner,
          },
        );
        setLotteryClient(lotteryClient);

        const assetId = await lotteryClient.state.global.ticketToken();

        if (!assetId) {
          throw new Error("Asset ID not found");
        }

        const { decimals: assetDecimals } =
          await algorand.asset.getById(assetId);

        const { balance: assetBalance } =
          await algorand.asset.getAccountInformation(activeAddress, assetId);

        setAssetBalance(Number(assetBalance) / Math.pow(10, assetDecimals));

        const {
          gameRound,
          gameStatus,
          winningTicket,
          prizePool,
          committed,
          revealed,
        } = await getLotteryState(lotteryClient);

        setPrizePool(Number(prizePool!) / Math.pow(10, assetDecimals));
        setCommitted(committed === BigInt(1));
        setRevealed(revealed === BigInt(1));
        setWinningTicket(winningTicket);
        setGameStatus(gameStatus);

        const { tickets, players } = await getTickets({
          playerAddress: activeAddress,
          gameRound: gameRound!,
          transactionSigner,
          lotteryClient,
          algorand,
        });

        setTickets(tickets);
        setPlayers(players);
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
        winningTicket,
        lotteryClient,
        discountClient,
        algoLotteryClient,
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

async function getLotteryState(
  client: FanbetLotteryClient | FanbetAlgoLotteryClient,
) {
  const gameRound = await client.state.global.gameRound();
  const committed = await client.state.global.committed();
  const revealed = await client.state.global.revealed();
  const prizePool = await client.state.global.prizePool();
  const winningTicket: Ticket = await client.getWinningTicket();

  const gameStatus = (
    await client.state.global.gameStatus()
  ).asString() as GameStatus;

  return {
    winningTicket,
    gameStatus,
    prizePool,
    gameRound,
    committed,
    revealed,
  };
}

async function getTickets({
  lotteryClient,
  playerAddress,
  algorand,
  gameRound,
  transactionSigner,
}: {
  lotteryClient: FanbetLotteryClient | FanbetAlgoLotteryClient;
  algorand: AlgorandClient;
  playerAddress: string;
  gameRound: bigint;

  transactionSigner: (
    txnGroup: Transaction[],
    indexesToSign: number[],
  ) => Promise<Uint8Array[]>;
}) {
  const boxes = await lotteryClient.appClient.getBoxNames();
  let tickets: Ticket[] = [];

  const encoder = new TextEncoder();
  const playerBox = new Uint8Array([
    ...encoder.encode("p_"),
    ...decodeAddress(playerAddress).publicKey,
  ]);

  const present = boxes.some(
    (box) => box.nameRaw.toString() == playerBox.toString(),
  );

  if (present && gameRound) {
    const playerBoxValue = await lotteryClient.appClient.getBoxValue(playerBox);

    const playerDataview = new DataView(playerBoxValue.buffer);
    const playerAppID = BigInt(playerDataview.getBigUint64(0).toString());

    const playerClient = algorand.client.getTypedAppClientById(
      FanbetPlayerClient,
      {
        appId: playerAppID,
        appName: "FANBET PLAYER",
        defaultSender: playerAddress,
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

  return {
    tickets,
    players: boxes.length,
  };
}
