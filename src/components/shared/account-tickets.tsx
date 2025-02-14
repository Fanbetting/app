import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UnlockIcon } from "lucide-react";
import Image from "next/image";

export default function AccountTickets() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
        <UnlockIcon className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-start gap-2">
          <Image src="USDe.svg" width={24} height={24} alt="$" />
          <span className="text-2xl font-bold">280.30</span>
        </div>
      </CardContent>
    </Card>
  );
}
