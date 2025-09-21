import { useState, useEffect } from "react";
import tips from "@/data/tips.json";

export default function useDailyTip() {
  const [tip, setTip] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("dailyTip");
    const today = new Date().toDateString();

    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === today) {
        setTip(parsed.tip);
        return;
      }
    }

    refresh();
  }, []);

  const refresh = () => {
    const today = new Date().toDateString();
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setTip(randomTip);
    localStorage.setItem("dailyTip", JSON.stringify({ date: today, tip: randomTip }));
  };

  return { tip, refresh };
}
