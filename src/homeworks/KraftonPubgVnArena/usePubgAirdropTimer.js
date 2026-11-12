import { useEffect, useState } from 'react';

export function usePubgAirdropTimer(targetEpochMs, serverOffsetMs) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const resync = () => setNow(Date.now());
    const interval = window.setInterval(resync, 200);
    document.addEventListener('visibilitychange', resync);
    resync();

    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', resync);
    };
  }, [targetEpochMs, serverOffsetMs]);

  const remainingMs = Math.max(0, targetEpochMs - (now + serverOffsetMs));
  return { remainingMs, isLive: remainingMs === 0 };
}
