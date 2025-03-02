import { Tickets } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import BulkPurchase from "./bulk-purchase";

export default function PurchaseTickets() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-2">
        <CardTitle className="text-sm font-medium">Purchase Tickets</CardTitle>
        <Tickets className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <BulkPurchase />
      </CardContent>
    </Card>
  );
}
