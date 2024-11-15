"use client";

import { useState, useEffect } from "react";

export function useCountUp(
  end: number,
  duration: number = 1000,
  decimals: number = 2
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0); // Reset count when end value changes
    let startTimestamp: number | null = null;
    const startValue = 0; // Start from 0

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      setCount(startValue + (end - startValue) * progress);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [end, duration]);

  return Number(count.toFixed(decimals));
}
