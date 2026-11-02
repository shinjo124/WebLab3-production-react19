import { DeveloperCard } from './components/DeveloperCard.jsx';
import { PubgMatchTelemetry } from './components/PubgMatchTelemetry.jsx';
import { ScientistDirectory } from './components/ScientistDirectory.jsx';
import { SituationshipAnalyzer } from './components/SituationshipAnalyzer.jsx';

export function App() {
  return (
    <main>
      <h1>Lab 3</h1>
      <section aria-labelledby="exercise-1-title">
        <h2 id="exercise-1-title">Exercise 1: Developer Profile Card</h2>
        <DeveloperCard />
      </section>
      <section aria-labelledby="exercise-2-title">
        <h2 id="exercise-2-title">Exercise 2: Scientist Directory</h2>
        <ScientistDirectory />
      </section>
      <section aria-labelledby="exercise-3-title">
        <h2 id="exercise-3-title">Exercise 3: PUBG Vietnam Telemetry</h2>
        <PubgMatchTelemetry />
      </section>
      <section aria-labelledby="bonus-title">
        <h2 id="bonus-title">Bonus: Situationship Analyzer</h2>
        <SituationshipAnalyzer />
      </section>
    </main>
  );
}