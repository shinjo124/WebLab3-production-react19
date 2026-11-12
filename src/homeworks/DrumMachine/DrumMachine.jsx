import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useDrumKeyboard } from './useDrumKeyboard.js';
import styles from './DrumMachine.module.css';

const PADS = [
  { id: 'kick', name: 'Kick', code: 'KeyW', frequency: 72, type: 'sine' },
  { id: 'snare', name: 'Snare', code: 'KeyA', frequency: 180, type: 'triangle' },
  { id: 'closed-hat', name: 'Closed Hat', code: 'KeyS', frequency: 420, type: 'square' },
  { id: 'open-hat', name: 'Open Hat', code: 'KeyD', frequency: 600, type: 'square' },
  { id: 'low-tom', name: 'Low Tom', code: 'KeyJ', frequency: 110, type: 'triangle' },
  { id: 'mid-tom', name: 'Mid Tom', code: 'KeyK', frequency: 155, type: 'triangle' },
  { id: 'rim', name: 'Rim', code: 'KeyL', frequency: 320, type: 'square' },
];

const padMap = new Map(PADS.map((pad) => [pad.code, pad]));

export function DrumMachine() {
  const meterId = useId();
  const audioRef = useRef(null);
  const analyserRef = useRef(null);
  const [hits, setHits] = useState([]);
  const [pressedPad, setPressedPad] = useState(null);
  const [decibels, setDecibels] = useState(-60);

  const playPad = useCallback((padId) => {
    const pad = PADS.find(({ id }) => id === padId);
    if (!pad) return;

    let context = audioRef.current;
    if (!context) {
      context = new window.AudioContext();
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      analyser.connect(context.destination);
      analyserRef.current = analyser;
      audioRef.current = context;
    }
    context.resume();

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;
    const duration = pad.id.includes('hat') ? 0.08 : 0.24;
    oscillator.type = pad.type;
    oscillator.frequency.setValueAtTime(pad.frequency * (pad.id === 'kick' ? 4 : 1), now);
    oscillator.frequency.exponentialRampToValueAtTime(pad.frequency, now + 0.04);
    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    oscillator.connect(gain).connect(analyserRef.current);
    oscillator.start(now);
    oscillator.stop(now + duration);

    setHits((previous) => [...previous, `${pad.name} (${pad.code})`].slice(-10));
    setPressedPad(pad.id);
  }, []);

  useDrumKeyboard(padMap, playPad, true);

  useEffect(() => {
    if (!pressedPad) return undefined;
    const timer = window.setTimeout(() => setPressedPad(null), 120);
    return () => window.clearTimeout(timer);
  }, [pressedPad]);

  useEffect(() => {
    let frameId;
    let lastUpdate = 0;
    const sampleLevel = (time) => {
      const analyser = analyserRef.current;
      if (analyser && time - lastUpdate >= 100) {
        const samples = new Float32Array(analyser.fftSize);
        analyser.getFloatTimeDomainData(samples);
        const rms = Math.sqrt(samples.reduce((sum, sample) => sum + sample * sample, 0) / samples.length);
        setDecibels(rms ? Math.max(-60, 20 * Math.log10(rms)) : -60);
        lastUpdate = time;
      }
      frameId = window.requestAnimationFrame(sampleLevel);
    };
    frameId = window.requestAnimationFrame(sampleLevel);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => () => audioRef.current?.close(), []);

  return (
    <section className={styles.machine} aria-labelledby="drum-title">
      <h2 id="drum-title">Production Studio Drum Kit</h2>
      <section className={styles.pads} aria-label="Drum pads">
        {PADS.map((pad) => (
          <button
            key={pad.id}
            type="button"
            aria-pressed={pressedPad === pad.id}
            className={`${styles.pad} ${pressedPad === pad.id ? styles.padActive : ''}`}
            onClick={() => playPad(pad.id)}
          >
            <span>{pad.name}</span>
            <kbd>{pad.code.replace('Key', '')}</kbd>
          </button>
        ))}
      </section>
      <label className={styles.meterLabel} htmlFor={meterId}>Output level (dBFS)</label>
      <meter id={meterId} className={styles.meter} min="-60" max="0" value={decibels} />
      <span className={styles.decibelValue}>{decibels.toFixed(1)} dBFS</span>
      <output className={styles.hitLog} aria-live="polite" aria-label="Last 10 drum hits">
        {hits.length ? hits.map((hit, index) => <span key={`${index}-${hit}`}>{hit}</span>) : 'Play a pad to start the hit log.'}
      </output>
    </section>
  );
}
