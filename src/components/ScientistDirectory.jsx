import { useState } from 'react';

const initialPeople = [
  { id: 'goethe', name: 'Johann Goethe', age: 82, iq: 210 },
  { id: 'einstein', name: 'Albert Einstein', age: 76, iq: 205 },
  { id: 'davinci', name: 'Leonardo da Vinci', age: 67, iq: 180 },
  { id: 'newton', name: 'Isaac Newton', age: 84, iq: 190 },
];

export function ScientistDirectory() {
  const [people, setPeople] = useState(initialPeople);
  return (
    <section aria-label="Pioneer Directory">
      <p>Directory scaffold: search, filters, sorting, delete, and reset go here.</p>
      <ul>{people.map((person) => <li key={person.id}>{person.name} — IQ {person.iq}</li>)}</ul>
      <button type="button" onClick={() => setPeople(initialPeople)}>Reset directory</button>
    </section>
  );
}