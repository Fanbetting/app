import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";

export default function FaucetButton() {
  return (
    <Button variant="secondary">
      <Coins />
      Faucet
    </Button>
  );
}
