import { useState } from 'react';

export function calculateEffortScore(signals, actor) {
  return signals
    .filter((signal) => signal.actor === actor)
    .reduce((total, signal) => total + signal.steps * signal.multiplier, 0);
}

export function SituationshipAnalyzer() {
  const [signals, setSignals] = useState([]);
  const myScore = calculateEffortScore(signals, 'ME');
  const theirScore = calculateEffortScore(signals, 'THEM');

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
      <button type="button" onClick={() => addSignal('ME', 100, 0.1)}>
        Log my effort
      </button>
      <button type="button" onClick={() => addSignal('THEM', 1, 50)}>
        Log their effort
      </button>
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