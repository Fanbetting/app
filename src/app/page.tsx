import AccountInfo from "@/components/shared/account-info";
import AppInfo from "@/components/shared/app-info";
import CountdownTimer from "@/components/shared/countdown-timer";
import PurchaseTicket from "@/components/shared/purchase-ticket";
import PurchaseTickets from "@/components/shared/purchase-tickets";
import PurchasedTickets from "@/components/shared/purchased-tickets";
import TicketEarnings from "@/components/shared/ticket-earnings";
import WinningTicket from "@/components/shared/winning-ticket";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HomePage() {
  return (
    <main className="flex flex-col gap-4 space-y-4 p-4">
      <div className="flex w-full items-center justify-center sm:hidden md:hidden">
        <WinningTicket />
      </div>

      <AccountInfo />

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList className="flex w-full">
          <TabsTrigger value="tickets" className="flex w-full justify-between">
            <AppInfo />
            <CountdownTimer />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-8">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="grid gap-4 lg:grid-rows-2">
              <PurchaseTicket />
              <PurchaseTickets />
            </div>
            <PurchasedTickets />
            <TicketEarnings />
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
