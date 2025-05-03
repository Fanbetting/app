import { AlgorandClient } from "@algorandfoundation/algokit-utils/types/algorand-client";
import { AlgoAmount } from "@algorandfoundation/algokit-utils/types/amount";
import { decodeAddress } from "algosdk";

import { FanbetAlgoLotteryClient } from "../contracts/FanbetAlgoLottery";
import { FanbetLotteryClient } from "../contracts/FanbetLottery";
import { LEGACY_DISCOUNT, REGULAR_DISCOUNT } from "./constants";
import { Asset, Holder, Ticket } from "./types";

export async function buyTicket({
  asset,
  ticket,
  holder,
  algorand,
  activeAddress,
  lotteryClient,
  algoLotteryClient,
}: {
  lotteryClient?: FanbetLotteryClient;
  algoLotteryClient?: FanbetAlgoLotteryClient;
  holder: Holder;
  asset: Asset;
  algorand: AlgorandClient;
  activeAddress: string;
  ticket: Ticket;
}) {
  if (asset === "ALGO" && algoLotteryClient) {
    const storageCost = await algoLotteryClient.getStorageCost({
      args: {
        numOfTickets: BigInt(1),
      },
    });

    const paymentAmount = new AlgoAmount({ microAlgos: storageCost });
    const storageTxn = await algorand.createTransaction.payment({
      sender: activeAddress,
      receiver: algoLotteryClient.appAddress,
      amount: paymentAmount,
    });

    const ticketPrice = await algoLotteryClient.state.global.ticketPrice();
    if (!ticketPrice) {
      throw new Error("Invalid Ticket Price");
    }

    let transferAmount = ticketPrice;

    if (holder.legacy) {
      transferAmount -= (ticketPrice * LEGACY_DISCOUNT) / BigInt(100);
    } else if (holder.regular) {
      transferAmount -= (ticketPrice * REGULAR_DISCOUNT) / BigInt(100);
    }

    const purchaseTxn = await algorand.createTransaction.payment({
      sender: activeAddress,
      receiver: algoLotteryClient.appAddress,
      amount: AlgoAmount.MicroAlgos(transferAmount),
    });

    const result = await algoLotteryClient
      .newGroup()
      .buyTickets({
        args: {
          storageTxn,
          purchaseTxn,
          guesses: [ticket],
        },
        validityWindow: 1000,
        maxFee: AlgoAmount.Algos(0.5),
      })
      .send({
        populateAppCallResources: true,
        coverAppCallInnerTransactionFees: true,
      });

    return result;
  } else if (lotteryClient) {
    const storageCost = await lotteryClient.getStorageCost({
      args: {
        numOfTickets: BigInt(1),
      },
    });

    const paymentAmount = new AlgoAmount({ microAlgos: storageCost });
    const storageTxn = await algorand.createTransaction.payment({
      sender: activeAddress,
      receiver: lotteryClient.appAddress,
      amount: paymentAmount,
    });

    const ticketPrice = await lotteryClient.state.global.ticketPrice();
    const ticketToken = await lotteryClient.state.global.ticketToken();
    if (!ticketPrice || !ticketToken) {
      throw new Error("Invalid Ticket Price or Token");
    }

    let transferAmount = ticketPrice;

    if (holder.legacy) {
      transferAmount -= (ticketPrice * LEGACY_DISCOUNT) / BigInt(100);
    } else if (holder.regular) {
      transferAmount -= (ticketPrice * REGULAR_DISCOUNT) / BigInt(100);
    }

    const purchaseTxn = await algorand.createTransaction.assetTransfer({
      assetId: ticketToken,
      sender: activeAddress,
      receiver: lotteryClient.appAddress,
      amount: transferAmount,
    });

    const result = await lotteryClient
      .newGroup()
      .buyTickets({
        args: {
          payTxn: storageTxn,
          axferTxn: purchaseTxn,
          guesses: [ticket],
        },
        validityWindow: 1000,
        maxFee: AlgoAmount.Algos(0.5),
      })
      .send({
        populateAppCallResources: true,
        coverAppCallInnerTransactionFees: true,
      });

    return result;
  }
}

export async function buyTickets({
  asset,
  amount,
  holder,
  algorand,
  activeAddress,
  lotteryClient,
  algoLotteryClient,
}: {
  lotteryClient?: FanbetLotteryClient;
  algoLotteryClient?: FanbetAlgoLotteryClient;
  holder: Holder;
  asset: Asset;
  algorand: AlgorandClient;
  activeAddress: string;
  amount: number;
}) {
  const tickets = randomTickets(amount);

  if (asset === "ALGO" && algoLotteryClient) {
    const storageCost = await algoLotteryClient.getStorageCost({
      args: {
        numOfTickets: amount,
      },
    });

    const paymentAmount = new AlgoAmount({ microAlgos: storageCost });
    const storageTxn = await algorand.createTransaction.payment({
      sender: activeAddress,
      receiver: algoLotteryClient.appAddress,
      amount: paymentAmount,
    });

    const ticketPrice = await algoLotteryClient.state.global.ticketPrice();
    if (!ticketPrice) {
      throw new Error("Invalid Ticket Price");
    }

    let transferAmount = ticketPrice;

    if (holder.legacy) {
      transferAmount -= (ticketPrice * LEGACY_DISCOUNT) / BigInt(100);
    } else if (holder.regular) {
      transferAmount -= (ticketPrice * REGULAR_DISCOUNT) / BigInt(100);
    }

    transferAmount *= BigInt(amount);
    const purchaseTxn = await algorand.createTransaction.payment({
      sender: activeAddress,
      receiver: algoLotteryClient.appAddress,
      amount: AlgoAmount.MicroAlgos(transferAmount),
    });

    const result = await algoLotteryClient
      .newGroup()
      .buyTickets({
        args: {
          storageTxn,
          purchaseTxn,
          guesses: tickets,
        },
        validityWindow: 1000,
        maxFee: AlgoAmount.Algos(0.5),
      })
      .send({
        populateAppCallResources: true,
        coverAppCallInnerTransactionFees: true,
      });

    return result;
  } else if (lotteryClient) {
    const storageCost = await lotteryClient.getStorageCost({
      args: {
        numOfTickets: amount,
      },
    });

    const paymentAmount = new AlgoAmount({ microAlgos: storageCost });
    const storageTxn = await algorand.createTransaction.payment({
      sender: activeAddress,
      receiver: lotteryClient.appAddress,
      amount: paymentAmount,
    });

    const ticketPrice = await lotteryClient.state.global.ticketPrice();
    const ticketToken = await lotteryClient.state.global.ticketToken();
    if (!ticketPrice || !ticketToken) {
      throw new Error("Invalid Ticket Price or Token");
    }

    let transferAmount = ticketPrice;

    if (holder.legacy) {
      transferAmount -= (ticketPrice * LEGACY_DISCOUNT) / BigInt(100);
    } else if (holder.regular) {
      transferAmount -= (ticketPrice * REGULAR_DISCOUNT) / BigInt(100);
    }

    transferAmount *= BigInt(amount);

    const purchaseTxn = await algorand.createTransaction.assetTransfer({
      assetId: ticketToken,
      sender: activeAddress,
      receiver: lotteryClient.appAddress,
      amount: transferAmount,
    });

    const result = await lotteryClient
      .newGroup()
      .buyTickets({
        args: {
          payTxn: storageTxn,
          axferTxn: purchaseTxn,
          guesses: tickets,
        },
        validityWindow: 1000,
        maxFee: AlgoAmount.Algos(0.5),
      })
      .send({
        populateAppCallResources: true,
        coverAppCallInnerTransactionFees: true,
      });

    return result;
  }
}

export async function registerUser({
  lotteryClient,
  activeAddress,
  algorand,
}: {
  lotteryClient: FanbetLotteryClient | FanbetAlgoLotteryClient;
  algorand: AlgorandClient;
  activeAddress: string;
}) {
  const boxes = await lotteryClient.appClient.getBoxNames();
  const encoder = new TextEncoder();

  const playerBoxName = new Uint8Array([
    ...encoder.encode("p_"),
    ...decodeAddress(activeAddress).publicKey,
  ]);

  const registered = boxes.some(
    (box) => box.nameRaw.toString() == playerBoxName.toString(),
  );

  if (registered) {
    return;
  }

  const registrationCost = await lotteryClient.getRegistrationCost();
  const paymentAmount = new AlgoAmount({ microAlgos: registrationCost });

  const paymentTxn = await algorand.createTransaction.payment({
    sender: activeAddress,
    amount: paymentAmount,
    receiver: lotteryClient.appAddress,
  });

  await lotteryClient
    .newGroup()
    .register({
      args: {
        payTxn: paymentTxn,
      },
      validityWindow: 1000,
      maxFee: AlgoAmount.Algos(0.5),
      note: "One Time Registration Fee",
    })
    .send({
      populateAppCallResources: true,
      coverAppCallInnerTransactionFees: true,
    });
}

export function randomTickets(amount: number): Ticket[] {
  const tickets: Ticket[] = [];

  for (let i = 0; i < amount; i++) {
    const ticket: Ticket = [0, 0, 0, 0, 0];

    for (let i = 0; i < 5; i++) {
      let uniqueNumber;

      while (!uniqueNumber || ticket.includes(uniqueNumber)) {
        uniqueNumber = Math.floor(Math.random() * 32) + 1;
      }

      ticket[i] = uniqueNumber;
    }
  }

  return tickets;
}
