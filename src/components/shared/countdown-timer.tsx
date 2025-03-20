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

      const epochTime = new Date(0);
      const elapsedMs = now.getTime() - epochTime.getTime();

      const msIn3Days = 3 * 24 * 60 * 60 * 1000;
      const positionInCycle = elapsedMs % msIn3Days;

      let nextPhaseTime, nextPhaseName;

      const openPhaseDuration = 48 * 60 * 60 * 1000;
      const submissionPhaseDuration = 12 * 60 * 60 * 1000;

      if (positionInCycle < openPhaseDuration) {
        nextPhaseTime = openPhaseDuration - positionInCycle;
        nextPhaseName = "Tickets Submission";
      } else if (
        positionInCycle <
        openPhaseDuration + submissionPhaseDuration
      ) {
        nextPhaseTime =
          openPhaseDuration + submissionPhaseDuration - positionInCycle;
        nextPhaseName = "Payout";
      } else {
        nextPhaseTime = msIn3Days - positionInCycle;
        nextPhaseName = "Next Game Round";
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
    <h3 className="space-x-2">
      <span>{nextPhase} in: </span>
      <span>
        {formatNumber(timeRemaining.hours)} hrs :{" "}
        {formatNumber(timeRemaining.minutes)} mins :{" "}
        {formatNumber(timeRemaining.seconds)} secs
      </span>
    </h3>
  );
}
