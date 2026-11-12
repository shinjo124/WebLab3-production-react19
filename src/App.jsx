import { useEffect, useRef, useState } from 'react';
import { DeveloperCard } from './components/DeveloperCard.jsx';
import { PubgMatchTelemetry } from './components/PubgMatchTelemetry.jsx';
import { ScientistDirectory } from './components/ScientistDirectory.jsx';
import { DrumMachine } from './homeworks/DrumMachine/DrumMachine.jsx';
import { GrandPiano88 } from './homeworks/GrandPiano88/GrandPiano88.jsx';
import { KraftonPubgVnArena } from './homeworks/KraftonPubgVnArena/KraftonPubgVnArena.jsx';

const VIEWS = {
  ex1: { label: 'Exercise 1: Developer Profile Card', component: DeveloperCard },
  ex2: { label: 'Exercise 2: Scientist Directory', component: ScientistDirectory },
  ex3: { label: 'Exercise 3: PUBG Vietnam Telemetry', component: PubgMatchTelemetry },
  hw1: { label: 'Homework 1: Drum Machine', component: DrumMachine },
  hw2: { label: 'Homework 2: 88-Key Piano', component: GrandPiano88 },
  hw3: { label: 'Homework 3: KRAFTON PUBG VN Arena', component: KraftonPubgVnArena },
};

const NAV_GROUPS = [
  { label: 'Exercises', links: [['ex1', 'Exercise 1'], ['ex2', 'Exercise 2'], ['ex3', 'Exercise 3']] },
  { label: 'Homeworks', links: [['hw1', 'Homework 1'], ['hw2', 'Homework 2'], ['hw3', 'Homework 3']] },
];

function getViewFromHash() {
  const viewId = window.location.hash.slice(1);
  return Object.hasOwn(VIEWS, viewId) ? viewId : 'ex1';
}

export function App() {
  const [activeView, setActiveView] = useState(getViewFromHash);
  const headingRef = useRef(null);
  const view = VIEWS[activeView];
  const ActiveComponent = view.component;

  useEffect(() => {
    if (!Object.hasOwn(VIEWS, window.location.hash.slice(1))) {
      window.history.replaceState(null, '', '#ex1');
    }

    const syncView = () => {
      const viewId = window.location.hash.slice(1);
      if (Object.hasOwn(VIEWS, viewId)) {
        setActiveView(viewId);
      } else {
        window.history.replaceState(null, '', '#ex1');
        setActiveView('ex1');
      }
    };

    window.addEventListener('hashchange', syncView);
    return () => window.removeEventListener('hashchange', syncView);
  }, []);

  useEffect(() => {
    document.title = view.label + ' | Lab 3';
    headingRef.current?.focus();
  }, [view]);

  return (
    <>
      <nav className="appNavigation" aria-label="Lab navigation">
        {NAV_GROUPS.map((group) => (
          <section key={group.label} aria-labelledby={group.label + '-navigation-title'}>
            <h2 id={group.label + '-navigation-title'}>{group.label}</h2>
            <ul>
              {group.links.map(([viewId, label]) => (
                <li key={viewId}>
                  <a href={'#' + viewId} aria-current={activeView === viewId ? 'page' : undefined}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>
      <main>
        <h1 ref={headingRef} tabIndex={-1}>{view.label}</h1>
        <ActiveComponent />
      </main>
    </>
  );
}