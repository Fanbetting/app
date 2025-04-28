"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Asset } from "@/lib/hooks/providers/account-provider";
import useAccount from "@/lib/hooks/use-account";
import { useToast } from "@/lib/hooks/use-toast";
import { ReactNode, useState } from "react";

export default function AssetSelector({ children }: { children: ReactNode }) {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>();
  const { toast } = useToast();
  const { asset, setAsset } = useAccount();

  if (asset === undefined) {
    const handleSelect = () => {
      if (!selectedAsset) {
        toast({
          title: "Please select an asset",
          description: "You must select an asset to continue.",
          variant: "destructive",
        });

        return;
      }

      localStorage.setItem("selectedAsset", selectedAsset);
      setAsset(selectedAsset);
    };

    return (
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Select your Payment Asset</AlertDialogTitle>
            <AlertDialogDescription>
              What asset would you like to use for your transactions?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from(["ALGO", "FBET", "USDC", "IPT"]).map((asset) => (
              <div
                key={asset}
                className={`${selectedAsset === asset ? "border-green-500 text-green-500" : "border-gray-300"} flex cursor-pointer items-center justify-center rounded-lg border p-4 hover:bg-secondary hover:text-primary`}
                onClick={() => {
                  setSelectedAsset(asset as Asset);
                }}
              >
                {asset}
              </div>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleSelect}>Select</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return <>{children}</>;
}
