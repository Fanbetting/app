"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useAccount from "@/lib/hooks/use-account";
import { WalletIcon, Ticket, Landmark, Users } from "lucide-react";

export default function AccountInfo() {
  const { algoBalance, fbetBalance, players, prizePool } = useAccount();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ALGO Balance</CardTitle>
          <WalletIcon className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-start gap-2">
            <span className="text-2xl font-bold">{algoBalance}</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">FBET Balance</CardTitle>
          <Ticket className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-start gap-2">
            <span className="text-2xl font-bold">{fbetBalance}</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Lottery Prize Pool
          </CardTitle>
          <Landmark className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-start gap-2">
            <span className="text-2xl font-bold">{prizePool}</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Players</CardTitle>
          <Users className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-start gap-2">
            <span className="text-2xl font-bold">{players}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
