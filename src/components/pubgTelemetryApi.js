const MOCK_TELEMETRY = {
  ces: {
    id: 'ces',
    name: 'Cerberus Esports',
    map: 'Erangel',
    phase: 'Phase 6',
    alive: 4,
    kills: 14,
    wwcdProb: '68%',
    status: 'In Safe Zone',
  },
  te: {
    id: 'te',
    name: 'The Expendables',
    map: 'Miramar',
    phase: 'Phase 7',
    alive: 4,
    kills: 18,
    wwcdProb: '82%',
    status: 'Holding High Ground',
  },
  ge: {
    id: 'ge',
    name: 'Genius Esports',
    map: 'Taego',
    phase: 'Phase 5',
    alive: 3,
    kills: 9,
    wwcdProb: '41%',
    status: 'Rotating Blue Zone',
  },
};

export function fetchKraftonPubgTelemetry(squadId, { signal } = {}) {
  return new Promise((resolve, reject) => {
    let settled = false;
    let timerId;

    const cleanup = () => {
      window.clearTimeout(timerId);
      signal?.removeEventListener('abort', handleAbort);
    };

    const settle = (callback, value) => {
      if (settled) return;
      settled = true;
      cleanup();
      callback(value);
    };

    const handleAbort = () => {
      const error = new Error('The telemetry request was aborted.');
      error.name = 'AbortError';
      settle(reject, error);
    };

    if (signal?.aborted) {
      handleAbort();
      return;
    }

    timerId = window.setTimeout(() => {
      if (Math.random() < 0.35) {
        settle(reject, new Error('Satellite packet loss. Reconnect and retry.'));
        return;
      }

      const telemetry = MOCK_TELEMETRY[squadId];
      if (!telemetry) {
        settle(reject, new Error(`Unknown squad: ${squadId}`));
        return;
      }

      settle(resolve, { ...telemetry });
    }, 1200);

    signal?.addEventListener('abort', handleAbort, { once: true });
  });
}