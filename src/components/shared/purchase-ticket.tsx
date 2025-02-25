import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketPlus } from "lucide-react";

import TicketInput from "./ticket-input";

export default function PurchaseTicket() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Purchase Ticket </CardTitle>
        <TicketPlus className="h-4 w-4" />
      </CardHeader>
      <CardContent className="space-y-4">
        <TicketInput />
      </CardContent>
    </Card>
  );
}
