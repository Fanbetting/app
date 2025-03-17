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
import { useToast } from "@/lib/hooks/use-toast";
import { ensureError } from "@/lib/utils/convert";
import { Ticket } from "@/lib/utils/ticket";
import { AlgorandClient } from "@algorandfoundation/algokit-utils/types/algorand-client";
import { AlgoAmount } from "@algorandfoundation/algokit-utils/types/amount";
import { zodResolver } from "@hookform/resolvers/zod";
import { NetworkId, useNetwork, useWallet } from "@txnlab/use-wallet-react";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  amount: z.coerce
    .number({ message: "Must be number" })
    .min(1, { message: "Lesser than 1" })
    .max(100, { message: "Greater than 100" }),
});

export default function BulkPurchase() {
  const { algodClient, transactionSigner, activeAddress } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const { revealed, committed } = useAccount();
  const { activeNetwork } = useNetwork();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const randomTicket = () => {
    const ticket: Ticket = [0, 0, 0, 0, 0];

    for (let i = 0; i < 5; i++) {
      let uniqueNumber;

      while (!uniqueNumber || ticket.includes(uniqueNumber)) {
        uniqueNumber = Math.floor(Math.random() * 32) + 1;
      }

      ticket[i] = uniqueNumber;
    }

    return ticket;
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const { amount } = data;
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

      const lotteryAppID = BigInt(addresses[network].lotteryApp);
      const lotteryClient = algorand.client.getTypedAppClientById(
        FanbetLotteryClient,
        {
          appId: lotteryAppID,
          defaultSender: activeAddress,
          defaultSigner: transactionSigner,
        },
      );

      const lotteryAddress = lotteryClient.appAddress;

      const ticketPrice = await lotteryClient.state.global.ticketPrice();
      const ticketToken = await lotteryClient.state.global.ticketToken();

      if (!ticketPrice) {
        throw new Error("Invalid Ticket Price");
      }

      if (!ticketToken) {
        throw new Error("Invalid Ticket Token");
      }

      const tickets: Ticket[] = [];

      for (let i = 0; i < amount; i++) {
        tickets.push(randomTicket());
      }

      const storageCost = await lotteryClient.getStorageCost({
        args: {
          numOfTickets: amount,
        },
      });

      const paymentAmount = new AlgoAmount({ microAlgos: storageCost });
      const paymentTxn = await algorand.createTransaction.payment({
        sender: activeAddress,
        receiver: lotteryClient.appAddress,
        amount: paymentAmount,
      });

      const transferAmount = ticketPrice * BigInt(amount);
      const transferTxn = await algorand.createTransaction.assetTransfer({
        assetId: ticketToken,
        sender: activeAddress,
        receiver: lotteryAddress,
        amount: transferAmount,
      });

      const result = await lotteryClient
        .newGroup()
        .buyTickets({
          args: {
            payTxn: paymentTxn,
            axferTxn: transferTxn,
            guesses: tickets,
          },
          maxFee: new AlgoAmount({ algos: 1 }),
        })
        .send({
          populateAppCallResources: true,
          coverAppCallInnerTransactionFees: true,
        });

      toast({
        title: `${amount} tickets purchased`,
        description: `Transaction Group ID: ${result.groupId}`,
      });
    } catch (err) {
      const error = ensureError(err);
      console.error(error);

      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Amount of Tickets" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="default"
            size="lg"
            disabled={loading || revealed || committed}
          >
            {loading && <LoaderCircle className="h-4 w-4 animate-spin" />}
            Bulk Purchase
          </Button>
        </div>
      </form>
    </Form>
  );
}
