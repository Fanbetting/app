"use client";

import { useState, useEffect } from "react";

export default function CountdownTimer() {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [nextPhase, setNextPhase] = useState("");

  useEffect(() => {
    const calculatePhaseAndTime = () => {
      const now = new Date();
      const currentDay = now.getDay();
      const currentTime = now.getTime();

      let nextPhaseTime, nextPhaseName;

      if (currentDay >= 1 && currentDay <= 5) {
        // Monday to Friday: OpenPhase
        nextPhaseName = "Submission";
        const nextSaturday = new Date(now);

        nextSaturday.setDate(now.getDate() + (6 - currentDay));
        nextSaturday.setHours(0, 0, 0, 0);

        nextPhaseTime = nextSaturday.getTime() - currentTime;
      } else if (currentDay === 6) {
        // Saturday: Tickets Submission
        nextPhaseName = "Payout";
        const nextSunday = new Date(now);

        nextSunday.setDate(now.getDate() + 1);
        nextSunday.setHours(0, 0, 0, 0);

        nextPhaseTime = nextSunday.getTime() - currentTime;
      } else {
        // Sunday: Payout
        nextPhaseName = "Opens";
        const nextMonday = new Date(now);

        nextMonday.setDate(now.getDate() + 1);
        nextMonday.setHours(0, 0, 0, 0);

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

  return (
    <h3 className="space-x-2 text-xs md:text-sm">
      <span>{nextPhase}:</span>
      <span>
        {formatNumber(timeRemaining.days)} days :{" "}
        {formatNumber(timeRemaining.hours)} hrs :{" "}
        {formatNumber(timeRemaining.minutes)} mins :{" "}
        {formatNumber(timeRemaining.seconds)} secs
      </span>
    </h3>
  );
}
