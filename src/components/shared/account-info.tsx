import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LockIcon, TrendingUpIcon, WalletIcon, UnlockIcon } from "lucide-react";
import Image from "next/image";

export default function AccountInfo() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Available Balance
          </CardTitle>
          <UnlockIcon className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-start gap-2">
            <Image src="USDe.svg" width={24} height={24} alt="$" />
            <span className="text-2xl font-bold">280.30</span>
          </div>
        </CardContent>
      </Card>
      <Card>
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Accrued Interest
          </CardTitle>
          <TrendingUpIcon className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-start gap-2">
            <Image src="sUSDe.svg" width={24} height={24} alt="$" />
            <span className="text-2xl font-bold">32.05</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          <WalletIcon className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-start gap-2">
            <Image src="USDe.svg" width={24} height={24} alt="$" />
            <span className="text-2xl font-bold">887.63</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
