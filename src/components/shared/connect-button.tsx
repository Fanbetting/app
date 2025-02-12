"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/lib/hooks/use-toast";
import { Text } from "@/lib/styles/typography";
import { ellipseAddress, initialCapitalize } from "@/lib/utils/convert";
import { NetworkId, useWallet } from "@txnlab/use-wallet-react";
import { Check, Copy, LogIn, Globe, UserCheck2, User2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

export default function ConnectButton() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const { toast } = useToast();

  const { activeAddress, activeNetwork, setActiveNetwork, wallets } =
    useWallet();

  if (!mounted) {
    return <Skeleton className="h-10 w-40 px-4 py-2"></Skeleton>;
  }

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      toast({
        title: "Address Copied",
        description: "The wallet address has been copied to your clipboard.",
      });
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {activeAddress ? (
          <Button>Connected: {ellipseAddress(activeAddress, 3)}</Button>
        ) : (
          <Button>
            Connect Wallet
            <LogIn className="ml-2 h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Wallet </DialogTitle>
          <DialogDescription>
            Please select your wallet provider.
          </DialogDescription>
        </DialogHeader>

        {wallets.map((provider, index) => (
          <div key={`${provider.id}-${index}`}>
            <div className="flex-rol my-1 flex w-full justify-between">
              <Text variant="lead">{provider.metadata.name}</Text>
              {provider.isConnected &&
                (provider.isActive ? (
                  <Text variant="lead">Active Wallet</Text>
                ) : (
                  <Button onClick={() => provider.setActive()} variant="ghost">
                    Set Active
                  </Button>
                ))}
            </div>

            {provider.accounts.length > 0 ? (
              <ul className="space-y-2">
                {provider.accounts.map((account, index) => (
                  <li
                    key={`${provider.id}-${index}`}
                    className="flex items-center justify-between rounded-lg bg-secondary p-2 transition-all duration-300 ease-in-out hover:shadow-md"
                  >
                    {account.address == activeAddress ? (
                      <UserCheck2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <User2
                        className="h-4 w-4 cursor-pointer"
                        onClick={() =>
                          provider.setActiveAccount(account.address)
                        }
                      />
                    )}

                    <span
                      className="mr-2 cursor-pointer truncate font-mono text-sm"
                      onClick={() => provider.setActiveAccount(account.address)}
                    >
                      {ellipseAddress(account.address, 18)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(account.address, index)}
                      className="shrink-0"
                    >
                      {copiedIndex === index ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      <span className="sr-only">Copy address</span>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <ul>
                <li className="flex items-center justify-between rounded-lg bg-secondary p-3 transition-all duration-300 ease-in-out hover:shadow-md">
                  No accounts
                </li>
              </ul>
            )}

            <div className="my-4 flex justify-end gap-2">
              <Button
                key={`connect-${provider.metadata.name}-${index}`}
                onClick={() => provider.connect()}
                variant="default"
                disabled={provider.isConnected}
              >
                Connect
              </Button>

              <Button
                key={`disconnect-${provider.metadata.name}-${index}`}
                onClick={() => provider.connect()}
                variant="destructive"
                disabled={!provider.isConnected}
              >
                Disconnect
              </Button>
            </div>

            <Separator />
          </div>
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button type="button" variant="outline">
              <Globe className="mr-2 h-4 w-4" />
              {initialCapitalize(activeNetwork)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setActiveNetwork(NetworkId.BETANET)}
              disabled={activeNetwork === NetworkId.BETANET}
            >
              Betanet
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setActiveNetwork(NetworkId.LOCALNET)}
              disabled={activeNetwork === NetworkId.LOCALNET}
            >
              Localnet
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setActiveNetwork(NetworkId.TESTNET)}
              disabled={activeNetwork === NetworkId.TESTNET}
            >
              Testnet
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setActiveNetwork(NetworkId.MAINNET)}
              disabled={activeNetwork === NetworkId.MAINNET}
            >
              Mainnet
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </DialogContent>
    </Dialog>
  );
}
