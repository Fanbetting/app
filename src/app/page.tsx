import AccountInfo from "@/components/shared/account-info";
import AccountTickets from "@/components/shared/account-tickets";
import FaucetButton from "@/components/shared/faucet-button";
import PurchaseTicket from "@/components/shared/purchase-ticket";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HomePage() {
  return (
    <main className="flex-1 space-y-4 px-8 py-4">
      <AccountInfo />

      <div className="flex items-center justify-end space-x-4">
        <FaucetButton />
      </div>

      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="tickets" className="space-y-8">
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
            <AccountTickets />
            <PurchaseTicket />
            <AccountTickets />
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <div className="grid h-full gap-4 md:grid-cols-1 lg:grid-cols-3"></div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
