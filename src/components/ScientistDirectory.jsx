import { useId, useState } from 'react';
import styles from './ScientistDirectory.module.css';

export const SMART_PEOPLE = [
  { id: 'sp-1', name: 'Johann Goethe', age: 82, iq: 210 },
  { id: 'sp-2', name: 'Albert Einstein', age: 76, iq: 205 },
  { id: 'sp-3', name: 'Leonardo da Vinci', age: 67, iq: 180 },
  { id: 'sp-4', name: 'Isaac Newton', age: 84, iq: 190 },
  { id: 'sp-5', name: 'James Maxwell', age: 48, iq: 190 },
  { id: 'sp-6', name: 'William Sidis', age: 46, iq: 200 },
];

export function ScientistDirectory() {
  const searchId = useId();
  const minIqId = useId();
  const sortId = useId();
  const [people, setPeople] = useState(SMART_PEOPLE);
  const [query, setQuery] = useState('');
  const [minIq, setMinIq] = useState(160);
  const [sortBy, setSortBy] = useState('iq-desc');

  const normalizedQuery = query.trim().toLowerCase();
  const visiblePeople = people
    .filter((person) =>
      person.name.toLowerCase().includes(normalizedQuery) && person.iq >= minIq,
    )
    .toSorted((a, b) =>
      sortBy === 'iq-desc' ? b.iq - a.iq : a.age - b.age,
    );

  const handleDelete = (personId) => {
    setPeople((currentPeople) => currentPeople.filter((person) => person.id !== personId));
  };

  return (
    <section className={styles.directory} aria-label="Pioneer Directory">
      <form className={styles.form} role="search" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor={searchId}>Search by name</label>
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <label htmlFor={minIqId}>Minimum IQ</label>
        <input
          id={minIqId}
          type="number"
          value={minIq}
          onChange={(event) => {
            const value = event.target.valueAsNumber;
            setMinIq(Number.isNaN(value) ? 0 : value);
          }}
        />

        <label htmlFor={sortId}>Sort by</label>
        <select id={sortId} value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          <option value="iq-desc">IQ (highest first)</option>
          <option value="age-asc">Age (youngest first)</option>
        </select>
      </form>

      <div className={styles.actions}>
        <button className={styles.button} type="button" onClick={() => setPeople(SMART_PEOPLE)}>Reset</button>
      <output className={styles.count} role="status" aria-live="polite">Found {visiblePeople.length} people</output>
      </div>
      <ul className={styles.list}>
        {visiblePeople.map((person) => (
          <li className={styles.person} key={person.id}>
            {person.name} — Age {person.age}, IQ {person.iq}{' '}
            <button className={styles.button} type="button" onClick={() => handleDelete(person.id)}>
              Delete {person.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}