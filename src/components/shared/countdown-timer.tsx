"use client";

import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { useState, useEffect } from "react";

export default function CountdownTimer() {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [nextPhase, setNextPhase] = useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const calculatePhaseAndTime = () => {
      const now = new Date();
      const currentDay = now.getUTCDay(); // Use UTC day
      const currentTime = now.getTime();

      let nextPhaseTime, nextPhaseName;

      if (currentDay >= 1 && currentDay <= 5) {
        // Monday to Friday: OpenPhase
        nextPhaseName = "Submission";
        const nextSaturday = new Date(now);

        nextSaturday.setUTCDate(now.getUTCDate() + (6 - currentDay));
        nextSaturday.setUTCHours(0, 0, 0, 0);

        nextPhaseTime = nextSaturday.getTime() - currentTime;
      } else if (currentDay === 6) {
        // Saturday: Tickets Submission
        nextPhaseName = "Payout";
        const nextSunday = new Date(now);

        nextSunday.setUTCDate(now.getUTCDate() + 1);
        nextSunday.setUTCHours(0, 0, 0, 0);

        nextPhaseTime = nextSunday.getTime() - currentTime;
      } else {
        // Sunday: Payout
        nextPhaseName = "Opens";
        const nextMonday = new Date(now);

        nextMonday.setUTCDate(now.getUTCDate() + 1);
        nextMonday.setUTCHours(0, 0, 0, 0);

        nextPhaseTime = nextMonday.getTime() - currentTime;
      }

      let totalSeconds = Math.floor(nextPhaseTime / 1000);
      const days = Math.floor(totalSeconds / (24 * 60 * 60));
      totalSeconds %= 24 * 60 * 60;
      const hours = Math.floor(totalSeconds / (60 * 60));
      totalSeconds %= 60 * 60;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      setTimeRemaining({ days, hours, minutes, seconds });
      setNextPhase(nextPhaseName);
    };

    calculatePhaseAndTime();
    const intervalId = setInterval(calculatePhaseAndTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatNumber = (num: number) => {
    return num.toString().padStart(2, "0");
  };

  if (!isDesktop) {
    return (
      <h3 className="text-xs md:text-sm">
        {nextPhase} in{" "}
        <span className="font-bold">
          {formatNumber(timeRemaining.days)}d :{" "}
          {formatNumber(timeRemaining.hours)}h :{" "}
          {formatNumber(timeRemaining.minutes)}m :{" "}
          {formatNumber(timeRemaining.seconds)}s
        </span>
      </h3>
    );
  }

  return (
    <h3 className="space-x-2 text-xs md:text-sm">
      {nextPhase} in{" "}
      <span>
        {formatNumber(timeRemaining.days)} days :{" "}
        {formatNumber(timeRemaining.hours)} hrs :{" "}
        {formatNumber(timeRemaining.minutes)} mins :{" "}
        {formatNumber(timeRemaining.seconds)} secs
      </span>
    </h3>
  );
}
