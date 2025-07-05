"use server";

import { getNfds } from "@/api/nfd";
import addresses from "@/data/addresses.json";
import { AlgorandClient } from "@algorandfoundation/algokit-utils/types/algorand-client";
import { Address, decodeAddress } from "algosdk";
import "server-only";

import {
  FanbetDiscounterClient,
  Holdings,
} from "../contracts/FanbetDiscounter";
import { FANBET_DOMAIN } from "./constants";
import { ensureError } from "./convert";
import { env } from "./env";

interface AddHoldingParams {
  network: keyof typeof addresses;
  address: Address;
}

export async function addHolding({ network, address }: AddHoldingParams) {
  const discountClient = getClient(network);
  const registered = await checkRegistration(discountClient, address);

  if (registered) {
    return;
  }

  const holdings: Holdings = {
    legacy: false,
    regular: false,
  };

  const response = await getNfds({
    address,
    network,
  });

  if (response instanceof Error) {
    console.error("Error fetching NFDS:", response);
    return;
  }

  const hasFanbetNfd = response.nfd.some((n) => n.name.endsWith(FANBET_DOMAIN));
  holdings.regular = hasFanbetNfd;

  await discountClient.send.addHolder({
    args: {
      holder: address.toString(),
      holding: holdings,
    },
    populateAppCallResources: true,
  });
}

interface UpdateHoldingParams {
  network: keyof typeof addresses;
  address: Address;
}

export async function updateHolding({ network, address }: UpdateHoldingParams) {
  const discountClient = getClient(network);
  const registered = await checkRegistration(discountClient, address);

  if (!registered) {
    return ensureError("Holder not registered");
  }

  const holdings: Holdings = await discountClient.getHolding({
    args: {
      holder: address.toString(),
    },
  });

  const response = await getNfds({
    address,
    network,
  });

  if (response instanceof Error) {
    return ensureError("Error fetching NFDS: " + response.message);
  }

  const hasFanbetNfd = response.nfd.some((n) => n.name.endsWith(FANBET_DOMAIN));

  if (holdings.regular !== hasFanbetNfd) {
    holdings.regular = hasFanbetNfd;

    await discountClient.send.updateHolder({
      args: {
        holder: address.toString(),
        holding: holdings,
      },
      populateAppCallResources: true,
    });
  }

  return holdings;
}

async function checkRegistration(
  discountClient: FanbetDiscounterClient,
  address: Address,
) {
  const boxes = await discountClient.appClient.getBoxNames();
  const encoder = new TextEncoder();

  const holderBoxName = new Uint8Array([
    ...encoder.encode("h_"),
    ...decodeAddress(address.toString()).publicKey,
  ]);

  const registered = boxes.some(
    (box) => box.nameRaw.toString() == holderBoxName.toString(),
  );

  return registered;
}

function getClient(network: keyof typeof addresses) {
  const algorand =
    network === "mainnet" ? AlgorandClient.mainNet() : AlgorandClient.testNet();

  const { EXECUTOR_MNEMONIC } = env;
  const executorAccount = algorand.account.fromMnemonic(EXECUTOR_MNEMONIC);

  const discountClient = algorand.client.getTypedAppClientById(
    FanbetDiscounterClient,
    {
      appId: BigInt(addresses[network].discountApp),
      defaultSender: executorAccount.addr,
      defaultSigner: executorAccount.signer,
    },
  );

  return discountClient;
}
