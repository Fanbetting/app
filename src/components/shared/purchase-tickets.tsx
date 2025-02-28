import { Tickets } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function PurchaseTickets() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Purchase Tickets</CardTitle>
        <Tickets className="h-4 w-4" />
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
