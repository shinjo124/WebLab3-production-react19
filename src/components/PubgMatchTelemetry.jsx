import { useEffect, useState } from 'react';
import { fetchKraftonPubgTelemetry } from './pubgTelemetryApi.js';
import styles from './PubgMatchTelemetry.module.css';

const SQUADS = [
  { id: 'ces', name: 'Cerberus Esports' },
  { id: 'te', name: 'The Expendables' },
  { id: 'ge', name: 'Genius Esports' },
];

export function PubgMatchTelemetry() {
  const [squadId, setSquadId] = useState('te');
  const [retryTick, setRetryTick] = useState(0);
  const [view, setView] = useState({ status: 'IDLE', squadId: null, data: null, error: null });
  const activeView = view.status === 'IDLE' || view.squadId !== squadId
    ? { status: 'LOADING', data: null, error: null }
    : view;

  useEffect(() => {
    const controller = new AbortController();

    fetchKraftonPubgTelemetry(squadId, { signal: controller.signal })
      .then((data) => setView({ status: 'SUCCESS', squadId, data, error: null }))
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setView({ status: 'ERROR', squadId, data: null, error: error.message });
      });

    return () => controller.abort();
  }, [squadId, retryTick]);

  const selectSquad = (nextSquadId) => {
    if (nextSquadId === squadId) return;
    setView({ status: 'LOADING', squadId: nextSquadId, data: null, error: null });
    setSquadId(nextSquadId);
  };

  const retry = () => {
    setView({ status: 'LOADING', squadId, data: null, error: null });
    setRetryTick((tick) => tick + 1);
  };

  return (
    <section className={styles.telemetry} aria-label="PUBG Vietnam match telemetry">
      <nav aria-label="Select PUBG squad">
        {SQUADS.map((squad) => (
          <button
            key={squad.id}
            type="button"
            aria-pressed={squadId === squad.id}
            onClick={() => selectSquad(squad.id)}
          >
            {squad.name}
          </button>
        ))}
      </nav>

      {activeView.status === 'LOADING' && (
        <section className={styles.skeleton} aria-busy="true" aria-label="Loading match telemetry">
          <span className={styles.skeletonLine} />
          <span className={styles.skeletonLine} />
          <span className={styles.skeletonLine} />
        </section>
      )}
      {activeView.status === 'ERROR' && (
        <section role="alert">
          <p>Telemetry unavailable: {activeView.error}</p>
          <button type="button" onClick={retry}>Reconnect satellite</button>
        </section>
      )}
      {activeView.status === 'SUCCESS' && (
        <article className={styles.matchCard} aria-live="polite">
          <h3>{activeView.data.name}</h3>
          <p>{activeView.data.map} · {activeView.data.phase}</p>
          <p>{activeView.data.alive} alive · {activeView.data.kills} kills</p>
          <p>WWCD chance: {activeView.data.wwcdProb}</p>
          <p>{activeView.data.status}</p>
        </article>
      )}
    </section>
  );
}