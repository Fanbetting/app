import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LockIcon } from "lucide-react";
import Image from "next/image";

export default function PurchaseTicket() {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Locked Balance</CardTitle>
        <LockIcon className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-start gap-2">
          <Image src="USDe.svg" width={24} height={24} alt="$" />
          <span className="text-2xl font-bold">575.28</span>
        </div>
      </CardContent>
    </Card>
  );
}
