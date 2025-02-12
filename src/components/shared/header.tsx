import ConnectButton from "@/components/shared/connect-button";
import { Text } from "@/lib/styles/typography"
import Link from "next/link";
import { TextAnimate } from "../magicui/text-animate";

export default function Header() {
  return (
    <header className="flex w-full items-center justify-between px-16 py-8">
      <Link href="/">
        <Text variant="large">
          <TextAnimate animation="blurIn" by="character">
            Fanbet
          </TextAnimate>
        </Text>
      </Link>

      <ConnectButton />
    </header>
  );
}
