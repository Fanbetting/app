import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tickets } from "lucide-react";

import { ScrollArea } from "../ui/scroll-area";
import AccountTickets from "./account-tickets";

export default function PurchasedTickets() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-2">
        <CardTitle className="text-sm font-medium">Purchased Tickets</CardTitle>
        <Tickets className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <AccountTickets />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
