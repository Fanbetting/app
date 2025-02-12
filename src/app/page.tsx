import { NavigationButton } from "@/components/shared/navigation-button";
import { ShineBorder } from "@/components/magicui/shine-border";
import { TextAnimate } from "@/components/magicui/text-animate";
import { Text } from "@/lib/styles/typography";
import { HandCoins, Flame } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center">
      <ShineBorder
        className="flex flex-col items-center justify-evenly gap-10 bg-secondary p-10"
        color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
      >
        <section className="flex flex-col items-center justify-center gap-2">

          <TextAnimate animation="blurIn" by="character">
            Lottery Demo
          </TextAnimate>
          <Text variant="lead">
            Please connect your wallet before clicking any of the buttons.
          </Text>
        </section>

        <section className="flex items-center justify-center gap-6">
          <NavigationButton variant="default" path="/withdraw">
            Withdraw
            <HandCoins className="ml-2 h-4 w-4" />
          </NavigationButton>

          <NavigationButton variant="destructive" path="/burn">
            Burn
            <Flame className="ml-2 h-4 w-4" />
          </NavigationButton>
        </section>
      </ShineBorder>
    </main>
  );
}
