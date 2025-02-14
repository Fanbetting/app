import AccountInfo from "@/components/shared/account-info";
import AccountTickets from "@/components/shared/account-tickets";
import PurchaseTicket from "@/components/shared/purchase-ticket";

export default function HomePage() {
  return (
    <main className="flex-1 space-y-4 px-8 py-4">
      <AccountInfo />
      <div className="grid h-full gap-4 md:grid-cols-1 lg:grid-cols-3">
        <AccountTickets />
        <PurchaseTicket />
      </div>
    </main>
  );
}
