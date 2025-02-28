import { useContext } from "react";

import { AccountContext } from "./providers/account-provider";

export default function useAccount() {
  return { ...useContext(AccountContext) };
}
