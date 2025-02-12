import { ShineBorder } from "@/components/magicui/shine-border";
import { TextAnimate } from "@/components/magicui/text-animate";
import { Text } from "@/lib/styles/typography";
import { Button } from "@/components/ui/button"
import { HandCoins, Flame } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center">
      <ShineBorder
        className="flex flex-col items-center justify-evenly gap-10 bg-secondary p-10"
        color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
      >
        <section className="flex flex-col items-center justify-center gap-2">
          <Text variant="lead">
            Replace this with the Generate
          </Text>
        </section>

        <section className="flex items-center justify-center gap-6">
          <Button variant="default">
            Withdraw
            <HandCoins className="ml-2 h-4 w-4" />
          </Button>

          <Button variant="destructive">
            Burn
            <Flame className="ml-2 h-4 w-4" />
          </Button>
        </section>
      </ShineBorder>
    </main>
  );
}
