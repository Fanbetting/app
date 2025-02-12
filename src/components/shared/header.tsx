import ConnectButton from "@/components/shared/connect-button";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex w-full items-center justify-between px-16 py-8">
      <Link href="/">
        <Image src="/logo.svg" alt="Atom Swap" width={200} height={50} />
      </Link>

    </header>
  );
}
