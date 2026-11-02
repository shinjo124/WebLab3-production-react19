import { useCallback, useEffect, useRef, useState } from 'react';
import { useDrumKeyboard } from './useDrumKeyboard.js';

const PADS = [
  { id: 'kick', label: 'Kick', code: 'KeyW', frequency: 90 },
  { id: 'snare', label: 'Snare', code: 'KeyA', frequency: 180 },
  { id: 'closed-hat', label: 'Closed Hat', code: 'KeyS', frequency: 420 },
  { id: 'open-hat', label: 'Open Hat', code: 'KeyD', frequency: 600 },
  { id: 'tom-low', label: 'Low Tom', code: 'KeyJ', frequency: 130 },
  { id: 'tom-mid', label: 'Mid Tom', code: 'KeyK', frequency: 220 },
  { id: 'tom-high', label: 'High Tom', code: 'KeyL', frequency: 330 },
];
const PAD_MAP = new Map(PADS.map((pad) => [pad.code, pad]));

export function DrumMachine() {
  const [hits, setHits] = useState([]);
  const [level, setLevel] = useState(0);
  const [activePadId, setActivePadId] = useState(null);
  const activeTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(activeTimer.current), []);

  const triggerPad = useCallback((padId) => {
    const pad = PADS.find((item) => item.id === padId);
    if (!pad) return;
    const audio = new window.AudioContext();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.frequency.value = pad.frequency;
    gain.gain.setValueAtTime(0.4, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.15);
    oscillator.connect(gain).connect(audio.destination);
    oscillator.start();
    oscillator.stop(audio.currentTime + 0.16);
    oscillator.onended = () => audio.close();
    setActivePadId(padId);
    window.clearTimeout(activeTimer.current);
    activeTimer.current = window.setTimeout(() => setActivePadId(null), 140);
    setLevel(80);
    setHits((previous) => [pad.label, ...previous].slice(0, 8));
  }, []);

  useDrumKeyboard(PAD_MAP, triggerPad);

  return (
    <section aria-label="Production studio drum kit">
      <p>Use W, A, S, D, J, K, and L or activate a pad.</p>
      <ul>
        {PADS.map((pad) => (
          <li key={pad.id}>
            <button type="button" aria-pressed={activePadId === pad.id} onClick={() => triggerPad(pad.id)}>
              {pad.label} ({pad.code.replace('Key', '')})
            </button>
          </li>
        ))}
      </ul>
      <meter min="0" max="100" value={level} aria-label="Hit level" />
      <output aria-live="polite">Recent hits: {hits.join(', ') || 'None'}</output>
    </section>
  );
}