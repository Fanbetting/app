import ConnectButton from "@/components/shared/connect-button";
import { Text } from "@/lib/styles/typography";
import Link from "next/link";

import { TextAnimate } from "../magicui/text-animate";
import GameStatus from "./game-status";
import WinningTicket from "./winning-ticket";

export default function Header() {
  return (
    <header className="flex w-full items-center justify-between px-8 py-8">
      <Link href="/">
        <Text variant="h1">
          <TextAnimate animation="blurIn" by="character">
            Fanbet Lottery
          </TextAnimate>
        </Text>
      </Link>

      <WinningTicket />
      <div className="flex flex-row justify-between gap-4">
        <GameStatus />
        <ConnectButton />
      </div>
    </header>
  );
}
