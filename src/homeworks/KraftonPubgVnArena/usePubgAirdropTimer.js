import { useEffect, useState } from 'react';

const calculateRemaining = (targetEpochMs, serverOffsetMs) =>
  Math.max(0, targetEpochMs - (Date.now() + serverOffsetMs));

export function usePubgAirdropTimer(targetEpochMs, serverOffsetMs = 0) {
  const [remainingMs, setRemainingMs] = useState(() =>
    calculateRemaining(targetEpochMs, serverOffsetMs),
  );

  useEffect(() => {
    const sync = () => setRemainingMs(calculateRemaining(targetEpochMs, serverOffsetMs));
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') sync();
    };
    sync();
    const timerId = window.setInterval(sync, 200);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      window.clearInterval(timerId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [targetEpochMs, serverOffsetMs]);

  return { remainingMs, isLive: remainingMs === 0 };
}