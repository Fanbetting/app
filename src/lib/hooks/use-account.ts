import { useContext } from "react";

import { AccountContext } from "./providers/account-provider";

export default function useAccount() {
  const { algoBalance, fbetBalance, tickets, prizePool, players } =
    useContext(AccountContext) ?? {};

  return { algoBalance, fbetBalance, tickets, prizePool, players };
}
