import { NetworkId } from "@txnlab/use-wallet-react";

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
