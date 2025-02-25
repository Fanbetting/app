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
import { useToast } from "@/lib/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
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

export default function TicketInput() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    toast({
      title: "Ticket Purchased",
      description: `You have
        purchased a ticket with the following numbers: ${Object.values(
          data,
        ).join(", ")}`,
    });
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
          <Button type="submit" variant="default" size="lg">
            Purchase
          </Button>
        </div>
      </form>
    </Form>
  );
}
