import ConnectButton from "@/components/shared/connect-button";
import Link from "next/link";

import FanbetLogo from "../logo/fanbet";
import GameStatus from "./game-status";
import WinningTicket from "./winning-ticket";

export default function Header() {
  return (
    <header className="flex w-full items-center justify-between px-8 py-8">
      <div className="flex flex-row items-center gap-8">
        <Link href="/">
          <FanbetLogo width="64" height="64" />
        </Link>

        <WinningTicket />
      </div>
      <div className="flex flex-row justify-between gap-4">
        <GameStatus />
        <ConnectButton />
      </div>
    </header>
  );
}
