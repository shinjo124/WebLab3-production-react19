export function calculateEffortScore(signals, actor) {
  return signals
    .filter((signal) => signal.actor === actor)
    .reduce((total, signal) => total + signal.steps * signal.multiplier, 0);
}