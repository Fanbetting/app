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
import { buyTicket, registerUser } from "@/lib/utils/helpers";
import { Ticket } from "@/lib/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNetwork, useWallet } from "@txnlab/use-wallet-react";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
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
});

export default function Purchase() {
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
      digit1: 0,
      digit2: 0,
      digit3: 0,
      digit4: 0,
      digit5: 0,
    },
  });

  const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
    const ticket: Ticket = Object.values(data) as Ticket;
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
          activeAddress,
          activeNetwork,
          algorand,
        });

        result = await buyTicket({
          asset,
          ticket,
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

        result = await buyTicket({
          asset,
          ticket,
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                      className="h-12 w-12 text-center md:h-16 md:w-16 md:text-xl"
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
