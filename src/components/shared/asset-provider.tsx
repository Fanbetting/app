"use client";

import useAccount from "@/lib/hooks/use-account";
import { ReactNode, useEffect, useState } from "react";

import AssetSelector from "./asset-selector";

export default function AssetProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { asset } = useAccount();

  useEffect(() => {
    if (asset) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [asset]);

  if (open) {
    return <AssetSelector open={open} setOpen={setOpen} />;
  }

  return <>{children}</>;
}
