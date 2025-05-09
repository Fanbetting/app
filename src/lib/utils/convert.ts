import { NetworkId } from "@txnlab/use-wallet-react";

import { Ticket } from "./types";

export function ellipseAddress(address = ``, width = 6): string {
  return address
    ? `${address.slice(0, width)}...${address.slice(-width)}`
    : address;
}

export function initialCapitalize(str = ``): string {
  return str ? `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}` : str;
}

export function ensureError(value: unknown): Error {
  if (value instanceof Error) return value;

  let stringified = "[Unable to stringify the thrown value]";
  try {
    stringified = JSON.stringify(value);
  } catch {
    // If the value is not serializable, we simply the default string message.
  }

  const error = new Error(
    `This value was thrown as is, not through an Error: ${stringified}`,
  );

  return error;
}

export function formatTransactionUrl(txId: string, network: NetworkId) {
  switch (network) {
    case "mainnet":
      return `https://lora.algokit.io/mainnet/transaction/${txId}`;

    case "testnet":
      return `https://lora.algokit.io/testnet/transaction/${txId}`;

    case "localnet":
      return `https://lora.algokit.io/localnet/transaction/${txId}`;

    default:
      throw new Error("Invalid Network");
  }
}

export function decodeWinningTicket(data: Uint8Array<ArrayBufferLike>): Ticket {
  const digits = data.slice(0, 5);
  const ticket: Ticket = [
    digits[0],
    digits[1],
    digits[2],
    digits[3],
    digits[4],
  ];

  return ticket;
}

type Player = {
  tickets: Array<Ticket>;
  ticketsRound: bigint;
};

export function decodePlayerInfo(data: Uint8Array): Player {
  const ticketsRound = BigInt(Buffer.from(data.slice(0, 8)).readIntBE(0, 8));
  const ticketsLength = Buffer.from(data.slice(10, 12)).readIntBE(0, 2);

  const tickets: Ticket[] = [];

  for (let i = 0; i < ticketsLength; i++) {
    const digits = data.slice(12 + i * 5, 12 + (i + 1) * 5);
    const ticket: Ticket = [
      digits[0],
      digits[1],
      digits[2],
      digits[3],
      digits[4],
    ];

    tickets.push(ticket);
  }

  return {
    tickets,
    ticketsRound,
  };
}
