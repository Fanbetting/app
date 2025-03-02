import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketPlus } from "lucide-react";

import Purchase from "./purchase";

export default function PurchaseTicket() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-2">
        <CardTitle className="text-sm font-medium">Purchase Ticket </CardTitle>
        <TicketPlus className="h-4 w-4" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Purchase />
      </CardContent>
    </Card>
  );
}
