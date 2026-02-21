"use client";

import { useEffect, useState } from "react";

const PLACEHOLDER = "--:--:--";

export function ClientClock() {
  const [time, setTime] = useState(PLACEHOLDER);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const update = () => {
      const now = new Date();
      const str = now.toLocaleTimeString("ko-KR", { hour12: false, timeZone: "Asia/Seoul", hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setTime(`${str} KST`);
    };
    update();
    const id = setInterval(update, 60000); // 1분 갱신
    return () => clearInterval(id);
  }, [mounted]);

  return <span>{mounted ? time : PLACEHOLDER}</span>;
}
