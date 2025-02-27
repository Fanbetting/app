import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tickets } from "lucide-react";

export default function AccountTickets() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Purchased Tickets</CardTitle>
        <Tickets className="h-4 w-4" />
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
