import ConnectButton from "@/components/shared/connect-button";
import Link from "next/link";

import FanbetLogo from "../logo/fanbet";
import AppSettings from "./app-settings";
import GameStatus from "./game-status";
import WinningTicket from "./winning-ticket";

export default function Header() {
  return (
    <header className="flex w-full flex-row items-center justify-between p-4">
      <div className="flex flex-row items-center justify-between gap-4 sm:justify-start md:gap-4">
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
        <AppSettings />
      </div>

      <div className="hidden items-center gap-2 md:flex">
        <GameStatus />
        <ConnectButton />
        <AppSettings />
      </div>
    </header>
  );
}
