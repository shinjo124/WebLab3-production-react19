import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useDrumKeyboard } from './useDrumKeyboard.js';
import styles from './DrumMachine.module.css';

const PADS = [
  { id: 'kick', name: 'Kick', code: 'KeyW' },
  { id: 'snare', name: 'Snare', code: 'KeyA' },
  { id: 'closed-hat', name: 'Closed Hat', code: 'KeyS' },
  { id: 'open-hat', name: 'Open Hat', code: 'KeyD' },
  { id: 'low-tom', name: 'Low Tom', code: 'KeyJ' },
  { id: 'mid-tom', name: 'Mid Tom', code: 'KeyK' },
  { id: 'crash', name: 'Crash', code: 'KeyL' },
];

const padMap = new Map(PADS.map((pad) => [pad.code, pad]));

export function DrumMachine() {
  const meterId = useId();
  const audioRef = useRef(null);
  const analyserRef = useRef(null);
  const noiseBufferRef = useRef(null);
  const activeVoicesRef = useRef(new Set());
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
      const noiseBuffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
      const noiseSamples = noiseBuffer.getChannelData(0);
      for (let index = 0; index < noiseSamples.length; index += 1) {
        noiseSamples[index] = Math.random() * 2 - 1;
      }
      noiseBufferRef.current = noiseBuffer;
      analyserRef.current = analyser;
      audioRef.current = context;
    }
    context.resume();

    const now = context.currentTime;
    const voice = { nodes: new Set(), sources: [], remaining: 0 };
    const addTone = (type, startHz, endHz, duration, volume) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(startHz, now);
      if (endHz) oscillator.frequency.exponentialRampToValueAtTime(endHz, now + Math.min(duration, 0.12));
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      oscillator.connect(gain).connect(analyserRef.current);
      voice.nodes.add(oscillator);
      voice.nodes.add(gain);
      voice.sources.push({ source: oscillator, endTime: now + duration });
    };
    const addNoise = (duration, cutoffHz, volume) => {
      const source = context.createBufferSource();
      const highpass = context.createBiquadFilter();
      const gain = context.createGain();
      source.buffer = noiseBufferRef.current;
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(cutoffHz, now);
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      source.connect(highpass).connect(gain).connect(analyserRef.current);
      voice.nodes.add(source);
      voice.nodes.add(highpass);
      voice.nodes.add(gain);
      voice.sources.push({ source, endTime: now + duration });
    };

    if (pad.id === 'kick') addTone('sine', 150, 50, 0.24, 0.7);
    if (pad.id === 'snare') {
      addNoise(0.2, 1500, 0.5);
      addTone('triangle', 180, null, 0.18, 0.35);
    }
    if (pad.id === 'closed-hat') addNoise(0.08, 7000, 0.32);
    if (pad.id === 'open-hat') addNoise(0.55, 6500, 0.3);
    if (pad.id === 'low-tom') addTone('sine', 150, 75, 0.3, 0.55);
    if (pad.id === 'mid-tom') addTone('sine', 210, 105, 0.24, 0.5);
    if (pad.id === 'crash') addNoise(1.4, 5000, 0.34);

    voice.remaining = voice.sources.length;
    activeVoicesRef.current.add(voice);
    for (const { source, endTime } of voice.sources) {
      source.onended = () => {
        source.disconnect();
        voice.remaining -= 1;
        if (voice.remaining === 0) {
          voice.nodes.forEach((node) => node.disconnect());
          activeVoicesRef.current.delete(voice);
        }
      };
      source.start(now);
      source.stop(endTime);
    }

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

  useEffect(() => () => {
    for (const voice of activeVoicesRef.current) {
      for (const { source } of voice.sources) {
        source.onended = null;
        source.stop();
      }
      voice.nodes.forEach((node) => node.disconnect());
    }
    activeVoicesRef.current.clear();
    audioRef.current?.close();
  }, []);

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
