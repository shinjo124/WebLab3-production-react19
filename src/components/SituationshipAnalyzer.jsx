import { useEffect, useState } from 'react';
import { calculateEffortScore } from './situationshipScore.js';

const ALLOWED_TRANSITIONS = {
  STRANGERS: ['DATING_NO_LOVE', 'SELF_RESPECT_EXIT'],
  DATING_NO_LOVE: ['COMMITTED', 'SELF_RESPECT_EXIT'],
  COMMITTED: ['SELF_RESPECT_EXIT'],
  SELF_RESPECT_EXIT: [],
};



export function SituationshipAnalyzer() {
  const [signals, setSignals] = useState([]);
  const [phase, setPhase] = useState('DATING_NO_LOVE');
  const myScore = calculateEffortScore(signals, 'ME');
  const theirScore = calculateEffortScore(signals, 'THEM');
  const isRedFlag = phase === 'DATING_NO_LOVE' && myScore < theirScore;

  useEffect(() => {
    if (phase !== 'DATING_NO_LOVE') return undefined;

    const timerId = window.setTimeout(() => setPhase('SELF_RESPECT_EXIT'), 5000);
    return () => window.clearTimeout(timerId);
  }, [phase, signals]);

  const transitionTo = (nextPhase) => {
    if (ALLOWED_TRANSITIONS[phase].includes(nextPhase)) setPhase(nextPhase);
  };

  const addSignal = (actor, steps, multiplier) => {
    const signal = {
      id: crypto.randomUUID(),
      actor,
      steps,
      multiplier,
    };
    setSignals((currentSignals) => [...currentSignals, signal]);
  };

  return (
    <section aria-label="Situationship effort analyzer">
      <h2>Effort signals</h2>
      <p>Phase: {phase}</p>
      {phase === 'STRANGERS' && (
        <button type="button" onClick={() => transitionTo('DATING_NO_LOVE')}>
          Start dating
        </button>
      )}
      {phase === 'DATING_NO_LOVE' && (
        <>
          <button type="button" onClick={() => transitionTo('COMMITTED')}>
            Commit
          </button>
          <button type="button" onClick={() => transitionTo('SELF_RESPECT_EXIT')}>
            End situationship
          </button>
        </>
      )}
      {phase === 'COMMITTED' && (
        <button type="button" onClick={() => transitionTo('SELF_RESPECT_EXIT')}>
          End relationship
        </button>
      )}
      {phase === 'SELF_RESPECT_EXIT' && <p>Exit phase reached.</p>}
      <button type="button" disabled={phase === 'SELF_RESPECT_EXIT'} onClick={() => addSignal('ME', 100, 0.1)}>
        Log my effort
      </button>
      <button type="button" disabled={phase === 'SELF_RESPECT_EXIT'} onClick={() => addSignal('THEM', 1, 50)}>
        Log their effort
      </button>
      <output role="status" aria-live="polite">
        {isRedFlag ? 'Red flag: effort is not reciprocal.' : 'Effort is balanced.'}
      </output>
      <p>My score: {myScore}</p>
      <p>Their score: {theirScore}</p>
      <ul aria-label="Effort signal log">
        {signals.map((signal) => (
          <li key={signal.id}>
            {signal.actor}: {signal.steps} × {signal.multiplier}
          </li>
        ))}
      </ul>
    </section>
  );
}