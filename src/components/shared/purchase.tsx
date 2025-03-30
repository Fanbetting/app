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
import useAccount from "@/lib/hooks/use-account";
import { toast, useToast } from "@/lib/hooks/use-toast";
import { LEGACY_DISCOUNT, REGULAR_DISCOUNT } from "@/lib/utils/constants";
import { ensureError } from "@/lib/utils/convert";
import { AlgorandClient } from "@algorandfoundation/algokit-utils/types/algorand-client";
import { AlgoAmount } from "@algorandfoundation/algokit-utils/types/amount";
import { zodResolver } from "@hookform/resolvers/zod";
import { NetworkId, useNetwork, useWallet } from "@txnlab/use-wallet-react";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
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

export default function Purchase() {
  const { algodClient, transactionSigner, activeAddress } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const { committed, revealed, holder } = useAccount();
  const { activeNetwork } = useNetwork();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      digit1: 0,
      digit2: 0,
      digit3: 0,
      digit4: 0,
      digit5: 0,
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const { digit1, digit2, digit3, digit4, digit5 } = data;
    setLoading(true);

    if (holder.legacy || holder.regular) {
      toast({
        title: "You are eligible for a discount",
        description: "You'll receive a discount on your ticket purchase",
      });
    }

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
      const ticketToken = await lotteryClient.state.global.ticketToken();

      if (!ticketPrice) {
        throw new Error("Invalid Ticket Price");
      }

      if (!ticketToken) {
        throw new Error("Invalid Ticket Token");
      }

      const storageCost = await lotteryClient.getStorageCost({
        args: {
          numOfTickets: BigInt(1),
        },
      });

      const paymentAmount = new AlgoAmount({ microAlgos: storageCost });
      const paymentTxn = await algorand.createTransaction.payment({
        sender: activeAddress,
        receiver: lotteryClient.appAddress,
        amount: paymentAmount,
      });

      let transferAmount = ticketPrice;

      if (holder.legacy) {
        transferAmount -= (ticketPrice * LEGACY_DISCOUNT) / BigInt(100);
        console.log(transferAmount);
      } else if (holder.regular) {
        transferAmount -= (ticketPrice * REGULAR_DISCOUNT) / BigInt(100);
      }

      const transferTxn = await algorand.createTransaction.assetTransfer({
        assetId: ticketToken,
        sender: activeAddress,
        receiver: lotteryClient.appAddress,
        amount: transferAmount,
      });

      const result = await lotteryClient
        .newGroup()
        .buyTickets({
          args: {
            payTxn: paymentTxn,
            axferTxn: transferTxn,
            guesses: [[digit1, digit2, digit3, digit4, digit5]],
          },
          maxFee: new AlgoAmount({ algos: 1 }),
        })
        .send({
          populateAppCallResources: true,
          coverAppCallInnerTransactionFees: true,
        });

      toast({
        title: "Ticket Purchased",
        description: `Transaction ID: ${result.txIds[1]}`,
      });
    } catch (err) {
      const error = ensureError(err);

      toast({
        title: "Something went wrong",
        description: error.message,
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
          <Button
            type="submit"
            variant="default"
            size="lg"
            disabled={loading || revealed || committed}
          >
            {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
            Purchase
          </Button>
        </div>
      </form>
    </Form>
  );
}
