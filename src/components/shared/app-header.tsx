import ConnectButton from "@/components/shared/connect-button";
import Link from "next/link";

import FanbetLogo from "../logo/fanbet";
import GameStatus from "./game-status";
import WinningTicket from "./winning-ticket";

export default function Header() {
  return (
    <header className="flex w-full flex-row items-center justify-between gap-4 p-4">
      <div className="flex flex-row items-center justify-between gap-3 sm:justify-start sm:gap-4 md:gap-8">
        <Link href="/" className="flex-shrink-0">
          <FanbetLogo />
        </Link>

        <div className="hidden sm:block">
          <WinningTicket />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:hidden">
        <GameStatus />
        <ConnectButton />
      </div>

      <div className="hidden items-center space-x-4 sm:block">
        <GameStatus />
        <ConnectButton />
      </div>
    </header>
  );
}
