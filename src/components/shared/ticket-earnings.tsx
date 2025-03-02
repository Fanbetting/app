import { TrendingUp } from "lucide-react";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import WinningsChart from "./winnings-chart";

export default function TicketEarnings() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-2">
        <CardTitle className="text-sm font-medium">Ticket Earnings</CardTitle>
        <TrendingUp className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <WinningsChart />
      </CardContent>
    </Card>
  );
}
