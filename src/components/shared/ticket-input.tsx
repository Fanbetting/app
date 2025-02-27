"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import addresses from "@/data/addresses.json";
import { FanbetLotteryClient } from "@/lib/contracts/FanbetLottery";
import { toast, useToast } from "@/lib/hooks/use-toast";
import { FBET_DECIMALS } from "@/lib/utils/constants";
import { ensureError } from "@/lib/utils/convert";
import { AlgorandClient } from "@algorandfoundation/algokit-utils/types/algorand-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { NetworkId, useNetwork, useWallet } from "@txnlab/use-wallet-react";
import { decodeAddress } from "algosdk";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { set, useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z
  .object({
    digit1: z.coerce
      .number({ message: "Must be number" })
      .min(1, { message: "Lesser than 1" })
      .max(32, { message: "Greater than 32" }),

    digit2: z.coerce
      .number({ message: "Must be number" })
      .min(1, { message: "Lesser than 1" })
      .max(32, { message: "Greater than 32" }),

    digit3: z.coerce
      .number({ message: "Must be number" })
      .min(1, { message: "Lesser than 1" })
      .max(32, { message: "Greater than 32" }),

    digit4: z.coerce
      .number({ message: "Must be number" })
      .min(1, { message: "Lesser than 1" })
      .max(32, { message: "Greater than 32" }),

    digit5: z.coerce
      .number({ message: "Must be number" })
      .min(1, { message: "Lesser than 1" })
      .max(32, { message: "Greater than 32" }),
  })
  .superRefine(({ digit1, digit2, digit3, digit4, digit5 }, ctx) => {
    const digits = new Set([digit1, digit2, digit3, digit4, digit5]);

    if (digits.size != 5) {
      toast({
        title: "Invalid Guess",
        description: "Digits must be unique",
        variant: "destructive",
      });

      ctx.addIssue({
        code: "custom",
        message: "Invalid Ticket Digits",
      });
    }
  });

export default function TicketInput() {
  const [loading, setLoading] = useState<boolean>(false);
  const { algodClient, transactionSigner, activeAddress } = useWallet();
  const { activeNetwork } = useNetwork();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const { digit1, digit2, digit3, digit4, digit5 } = data;
    setLoading(true);

    try {
      if (!activeAddress) {
        throw new Error("User wallet not connected");
      }

      const network = (
        activeNetwork == NetworkId.TESTNET
          ? "testnet"
          : activeNetwork == NetworkId.LOCALNET
            ? "localnet"
            : ""
      ) as keyof typeof addresses;

      const algorand = AlgorandClient.fromClients({
        algod: algodClient,
      }).setDefaultSigner(transactionSigner);

      const lotteryAddress = addresses[network].lotteryAddress;
      const lotteryAppID = BigInt(addresses[network].lotteryApp);

      const lotteryClient = algorand.client.getTypedAppClientById(
        FanbetLotteryClient,
        {
          appId: lotteryAppID,
          defaultSender: activeAddress,
          defaultSigner: transactionSigner,
        },
      );

      const ticketPrice = await lotteryClient.state.global.ticketPrice();
      const ticketToken = await lotteryClient.state.global.purchaseToken();

      if (!ticketPrice) {
        throw new Error("Invalid Ticket Price");
      }

      if (!ticketToken) {
        throw new Error("Invalid Ticket Token");
      }

      const transferTxn = await algorand.createTransaction.assetTransfer({
        assetId: ticketToken,
        sender: activeAddress,
        receiver: lotteryAddress,
        amount: ticketPrice * FBET_DECIMALS,
      });

      const encoder = new TextEncoder();

      const boxRef = {
        appId: lotteryAppID,
        name: new Uint8Array([
          ...encoder.encode("p_"),
          ...decodeAddress(activeAddress).publicKey,
        ]),
      };

      const result = await lotteryClient
        .newGroup()
        .buyTicket({
          args: {
            axferTxn: transferTxn,
            guess: [digit1, digit2, digit3, digit4, digit5],
          },

          boxReferences: [boxRef],
        })
        .send();

      toast({
        title: "Ticket Purchased",
        description: `Transaction ID: ${result.txIds[1]}`,
      });
    } catch (err) {
      const error = ensureError(err);

      toast({
        title: "Something went wrong",
        description: `${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex w-full items-center justify-between gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`digit${index + 1}` as `digit${1 | 2 | 3 | 4 | 5}`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="relative h-12 w-12 text-center md:text-xl lg:h-24 lg:w-24 lg:text-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="default" size="lg" disabled={loading}>
            {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
            Purchase
          </Button>
        </div>
      </form>
    </Form>
  );
}
