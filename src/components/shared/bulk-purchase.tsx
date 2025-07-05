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
import useAccount from "@/lib/hooks/use-account";
import { useToast } from "@/lib/hooks/use-toast";
import { ensureError } from "@/lib/utils/convert";
import { buyTickets, registerUser } from "@/lib/utils/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNetwork, useWallet } from "@txnlab/use-wallet-react";
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
  const { activeAddress } = useWallet();
  const { activeNetwork } = useNetwork();

  const [loading, setLoading] = useState<boolean>(false);
  const {
    asset,
    holder,
    algorand,
    revealed,
    committed,
    lotteryClient,
    algoLotteryClient,
  } = useAccount();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    const { amount } = data;
    setLoading(true);

    if (holder.legacy || holder.regular) {
      toast({
        title: "You are eligible for a discount",
        description: "You'll receive a discount on your ticket purchase",
      });
    }

    if (!algorand) {
      toast({
        title: "Something went wrong",
        description: "Algorand client not found",
        variant: "destructive",
      });
      return;
    }

    if (!asset) {
      toast({
        title: "Something went wrong",
        description: "Asset not found",
        variant: "destructive",
      });
      return;
    }

    if (!lotteryClient && !algoLotteryClient) {
      toast({
        title: "Something went wrong",
        description: "Lottery client not found",
        variant: "destructive",
      });
      return;
    }

    if (!activeAddress) {
      toast({
        title: "Something went wrong",
        description: "Active address not found",
        variant: "destructive",
      });
      return;
    }

    try {
      let result;

      if (asset === "ALGO" && algoLotteryClient) {
        await registerUser({
          lotteryClient: algoLotteryClient,
          activeNetwork,
          activeAddress,
          algorand,
        });

        result = await buyTickets({
          asset,
          amount,
          holder,
          algorand,
          activeAddress,
          activeNetwork,
          algoLotteryClient,
        });
      } else if (asset !== "ALGO" && lotteryClient) {
        await registerUser({
          lotteryClient,
          activeAddress,
          activeNetwork,
          algorand,
        });

        result = await buyTickets({
          asset,
          amount,
          holder,
          algorand,
          activeAddress,
          activeNetwork,
          lotteryClient,
        });
      }

      if (!result) {
        toast({
          title: "Something went wrong",
          description: "Transaction failed",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: `${amount} tickets purchased`,
        description: `Transaction Group ID: ${result.groupId}`,
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
