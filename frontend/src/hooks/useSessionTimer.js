import { useState, useEffect } from 'react';

export function useSessionTimer(endTime, status) {
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (status !== 'active' || !endTime) {
      setRemainingSeconds(0);
      return;
    }

    const calculate = () => {
      const diff = Math.floor((new Date(endTime).getTime() - Date.now()) / 1000);
      setRemainingSeconds(Math.max(0, diff));
    };

    calculate(); // hitung langsung saat mount, termasuk setelah refresh halaman
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [endTime, status]);

  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  const formatted = [hours, minutes, seconds].map((n) => String(n).padStart(2, '0')).join(':');

  return { remainingSeconds, formatted, isExpired: remainingSeconds <= 0 };
}