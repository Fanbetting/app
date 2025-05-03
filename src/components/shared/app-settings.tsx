"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Coins } from "lucide-react";
import { useState } from "react";

import { Button } from "../ui/button";
import AssetSelector from "./asset-selector";

export default function AppSettings() {
  const [open, setOpen] = useState(false);

  if (open) {
    return <AssetSelector open={open} setOpen={setOpen} />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Settings />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onEscapeKeyDown={() => setOpen(false)}
        onPointerDownOutside={() => setOpen(false)}
      >
        <DropdownMenuLabel>App Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setOpen(true)}>
          <Coins />
          Change Payment Asset
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
