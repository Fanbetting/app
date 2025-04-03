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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { useToast } from "@/lib/hooks/use-toast";
import { Text } from "@/lib/styles/typography";
import { ellipseAddress, initialCapitalize } from "@/lib/utils/convert";
import { NetworkId, useNetwork, useWallet } from "@txnlab/use-wallet-react";
import { Check, Copy, LogIn, Globe, UserCheck2, User2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

export default function ConnectButton() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { activeNetwork, setActiveNetwork } = useNetwork();
  const { activeAddress, wallets } = useWallet();
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  const isDesktop = useMediaQuery("(min-width: 768px)");
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <Skeleton className="h-9 w-40 px-4 py-2" />;
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

  if (!isDesktop) {
    return (
      <Drawer modal={false}>
        <DrawerTrigger asChild>
          {activeAddress ? (
            <Button variant="outline">
              Connected: {ellipseAddress(activeAddress, 3)}
            </Button>
          ) : (
            <Button variant="default">
              Connect Wallet
              <LogIn className="h-4 w-4" />
            </Button>
          )}
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {activeAddress ? "Connected" : "Connect Wallet"}
            </DrawerTitle>
            {!activeAddress && (
              <DrawerDescription>
                Please select your wallet provider.
              </DrawerDescription>
            )}
          </DrawerHeader>

          {activeAddress ? (
            wallets.map((wallet, index) =>
              wallet.isActive ? (
                <div
                  key={`${wallet.id}-${index}`}
                  className="my-2 space-y-2 px-2"
                >
                  <span className="flex items-center">
                    <Image
                      src={wallet.metadata.icon}
                      alt={wallet.metadata.name}
                      width={24}
                      height={24}
                      className="mr-2 h-6 w-6 rounded-full"
                    />
                    <Text variant="lead">{wallet.metadata.name} Wallet</Text>
                  </span>

                  <ul className="space-y-2">
                    {wallet.accounts.map((account, index) => (
                      <li
                        key={`${wallet.id}-${index}`}
                        className="flex items-center justify-between rounded-lg bg-secondary p-2 transition-all duration-300 ease-in-out hover:shadow-md"
                      >
                        {account.address == activeAddress ? (
                          <UserCheck2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <User2
                            className="h-4 w-4 cursor-pointer"
                            onClick={() =>
                              wallet.setActiveAccount(account.address)
                            }
                          />
                        )}
                        <span
                          className="mr-2 cursor-pointer truncate font-mono text-sm"
                          onClick={() =>
                            wallet.setActiveAccount(account.address)
                          }
                        >
                          {ellipseAddress(account.address, 12)}
                        </span>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            copyToClipboard(account.address, index)
                          }
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

                  <div>
                    <Button
                      key={`disconnect-${wallet.metadata.name}-${index}`}
                      onClick={() => wallet.disconnect()}
                      variant="destructive"
                      className="my-2 w-full"
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              ) : null,
            )
          ) : (
            <ul className="my-2 space-y-2">
              {wallets.map((wallet, index) => (
                <li
                  key={`${wallet.id}-${index}`}
                  className="flex cursor-pointer items-center justify-start rounded-lg px-4 py-2"
                  onClick={() => {
                    wallet.connect();
                  }}
                >
                  <Image
                    src={wallet.metadata.icon}
                    alt={wallet.metadata.name}
                    width={24}
                    height={24}
                    className="mr-2 h-6 w-6 rounded-full"
                  />

                  <Text variant="lead">{wallet.metadata.name} Wallet</Text>
                </li>
              ))}
            </ul>
          )}

          <ToggleNetwork
            activeNetwork={activeNetwork}
            setActiveNetwork={setActiveNetwork}
          />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {activeAddress ? (
          <Button variant="outline">
            Connected: {ellipseAddress(activeAddress, 3)}
          </Button>
        ) : (
          <Button variant="default">
            Connect Wallet
            <LogIn className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Connect Wallet </DialogTitle>
          <DialogDescription>
            Please select your wallet provider.
          </DialogDescription>
        </DialogHeader>

        {wallets.map((wallet, index) => (
          <div key={`${wallet.id}-${index}`}>
            <div className="flex-rol my-1 flex w-full justify-between">
              <span className="flex items-center">
                <Image
                  src={wallet.metadata.icon}
                  alt={wallet.metadata.name}
                  width={24}
                  height={24}
                  className="mr-2 h-6 w-6 rounded-full"
                />
                <Text variant="lead">{wallet.metadata.name} Wallet</Text>
              </span>
              {wallet.isConnected &&
                (wallet.isActive ? (
                  <Text variant="lead">Active Wallet</Text>
                ) : (
                  <Button onClick={() => wallet.setActive()} variant="ghost">
                    Set Active
                  </Button>
                ))}
            </div>

            {wallet.accounts.length > 0 ? (
              <ul className="space-y-2">
                {wallet.accounts.map((account, index) => (
                  <li
                    key={`${wallet.id}-${index}`}
                    className="flex items-center justify-between rounded-lg bg-secondary p-2 transition-all duration-300 ease-in-out hover:shadow-md"
                  >
                    {account.address == activeAddress ? (
                      <UserCheck2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <User2
                        className="h-4 w-4 cursor-pointer"
                        onClick={() => wallet.setActiveAccount(account.address)}
                      />
                    )}

                    <span
                      className="mr-2 cursor-pointer truncate font-mono text-sm"
                      onClick={() => wallet.setActiveAccount(account.address)}
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
                key={`connect-${wallet.metadata.name}-${index}`}
                onClick={() => wallet.connect()}
                variant="default"
                disabled={wallet.isConnected}
              >
                Connect
              </Button>

              <Button
                key={`disconnect-${wallet.metadata.name}-${index}`}
                onClick={() => wallet.disconnect()}
                variant="destructive"
                disabled={!wallet.isConnected}
              >
                Disconnect
              </Button>
            </div>

            <Separator />
          </div>
        ))}

        <ToggleNetwork
          activeNetwork={activeNetwork}
          setActiveNetwork={setActiveNetwork}
        />
      </DialogContent>
    </Dialog>
  );
}

function ToggleNetwork({
  activeNetwork,
  setActiveNetwork,
}: {
  activeNetwork: string;
  setActiveNetwork: (networkId: NetworkId | string) => Promise<void>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="my-2">
        <Button type="button" variant="outline">
          <Globe className="mr-2 h-4 w-4" />
          {initialCapitalize(activeNetwork)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => setActiveNetwork(NetworkId.MAINNET)}
          disabled={activeNetwork === NetworkId.MAINNET}
        >
          Mainnet
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setActiveNetwork(NetworkId.TESTNET)}
          disabled={activeNetwork === NetworkId.TESTNET}
        >
          Testnet
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setActiveNetwork(NetworkId.LOCALNET)}
          disabled={activeNetwork === NetworkId.LOCALNET}
        >
          Localnet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
