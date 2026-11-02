import { useEffect, useState } from 'react';
import { fetchKraftonPubgTelemetry } from './pubgTelemetryApi.js';

const SQUADS = [
  { id: 'ces', name: 'Cerberus Esports' },
  { id: 'te', name: 'The Expendables' },
  { id: 'ge', name: 'Genius Esports' },
];

export function PubgMatchTelemetry() {
  const [squadId, setSquadId] = useState('te');
  const [retryTick, setRetryTick] = useState(0);
  const [view, setView] = useState({ status: 'IDLE', data: null, error: null });

  useEffect(() => {
    const controller = new AbortController();
    setView({ status: 'LOADING', data: null, error: null });

    fetchKraftonPubgTelemetry(squadId, { signal: controller.signal })
      .then((data) => setView({ status: 'SUCCESS', data, error: null }))
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setView({ status: 'ERROR', data: null, error: error.message });
      });

    return () => controller.abort();
  }, [squadId, retryTick]);

  return (
    <section aria-label="PUBG Vietnam match telemetry">
      <nav aria-label="Select PUBG squad">
        {SQUADS.map((squad) => (
          <button
            key={squad.id}
            type="button"
            aria-pressed={squadId === squad.id}
            onClick={() => setSquadId(squad.id)}
          >
            {squad.name}
          </button>
        ))}
      </nav>

      {view.status === 'IDLE' && <p>Select a squad to load telemetry.</p>}
      {view.status === 'LOADING' && <p aria-busy="true">Syncing match telemetry…</p>}
      {view.status === 'ERROR' && (
        <section role="alert">
          <p>Telemetry unavailable: {view.error}</p>
          <button type="button" onClick={() => setRetryTick((tick) => tick + 1)}>
            Reconnect satellite
          </button>
        </section>
      )}
      {view.status === 'SUCCESS' && (
        <article aria-live="polite">
          <h3>{view.data.name}</h3>
          <p>{view.data.map} · {view.data.phase}</p>
          <p>{view.data.alive} alive · {view.data.kills} kills</p>
          <p>WWCD chance: {view.data.wwcdProb}</p>
          <p>{view.data.status}</p>
        </article>
      )}
    </section>
  );
}