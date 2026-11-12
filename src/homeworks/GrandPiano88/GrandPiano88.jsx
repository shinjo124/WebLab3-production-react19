import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { PianoKey } from './PianoKey.jsx';
import { PolyphonicSynth } from './PolyphonicSynth.js';
import styles from './GrandPiano88.module.css';

const PITCHES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const BLACK_PITCHES = new Set([1, 3, 6, 8, 10]);
const KEYS = Array.from({ length: 88 }, (_, index) => {
  const midi = index + 21;
  const pitch = midi % 12;
  return {
    midi,
    note: `${PITCHES[pitch]}${Math.floor(midi / 12) - 1}`,
    isBlack: BLACK_PITCHES.has(pitch),
  };
});

function wait(ms, signal) {
  return new Promise((resolve) => {
    if (signal.aborted) return resolve(false);

    const finish = (elapsed) => {
      window.clearTimeout(timer);
      signal.removeEventListener('abort', abort);
      resolve(elapsed);
    };
    const abort = () => finish(false);
    const timer = window.setTimeout(() => finish(true), ms);
    signal.addEventListener('abort', abort, { once: true });
  });
}

export function GrandPiano88() {
  const speedId = useId();
  const [synth] = useState(() => new PolyphonicSynth());
  const [pressedNotes, setPressedNotes] = useState(() => new Set());
  const [sequence, setSequence] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const mounted = useRef(false);
  const sequenceRef = useRef([]);
  const activeNotes = useRef(new Set());
  const activeRecordings = useRef(new Map());
  const lastRecordAt = useRef(null);
  const recordingRef = useRef(false);
  const playbackController = useRef(null);

  const noteOn = useCallback((midi) => {
    if (activeNotes.current.has(midi)) return;
    activeNotes.current.add(midi);
    synth.noteOn(midi);
    if (mounted.current) setPressedNotes((previous) => new Set(previous).add(midi));

    if (recordingRef.current) {
      const now = performance.now();
      const event = {
        midi,
        freqHz: 440 * 2 ** ((midi - 69) / 12),
        durationMs: 0,
        deltaMs: lastRecordAt.current == null ? 0 : now - lastRecordAt.current,
      };
      lastRecordAt.current = now;
      activeRecordings.current.set(midi, { event, startedAt: now });
      sequenceRef.current = [...sequenceRef.current, event];
      if (mounted.current) setSequence(sequenceRef.current);
    }
  }, [synth]);

  const noteOff = useCallback((midi) => {
    if (!activeNotes.current.delete(midi)) return;
    synth.noteOff(midi);
    if (mounted.current) {
      setPressedNotes((previous) => {
        if (!previous.has(midi)) return previous;
        const next = new Set(previous);
        next.delete(midi);
        return next;
      });
    }

    const recording = activeRecordings.current.get(midi);
    if (recording) {
      const previousEvent = recording.event;
      const completedEvent = { ...previousEvent, durationMs: performance.now() - recording.startedAt };
      recording.event = completedEvent;
      activeRecordings.current.delete(midi);
      sequenceRef.current = sequenceRef.current.map((event) => event === previousEvent ? completedEvent : event);
      if (mounted.current) setSequence(sequenceRef.current);
    }
  }, [synth]);

  const toggleRecording = () => {
    recordingRef.current = !recordingRef.current;
    if (recordingRef.current) {
      sequenceRef.current = [];
      setSequence([]);
      activeRecordings.current.clear();
      lastRecordAt.current = null;
    }
    setIsRecording(recordingRef.current);
  };

  const replay = useCallback(async () => {
    if (!sequenceRef.current.length || isRecording || isPlaying) return;

    const controller = new AbortController();
    playbackController.current = controller;
    const { signal } = controller;
    const queue = [...sequenceRef.current];
    const playingNotes = new Set();
    const releaseTasks = [];

    const releaseAll = () => {
      for (const midi of playingNotes) noteOff(midi);
      playingNotes.clear();
    };

    signal.addEventListener('abort', releaseAll, { once: true });
    setIsPlaying(true);
    try {
      while (queue.length && !signal.aborted) {
        const event = queue.shift();
        if (!await wait(event.deltaMs / speed, signal)) break;

        synth.noteOn(event.midi, event.freqHz);
        activeNotes.current.add(event.midi);
        if (mounted.current) setPressedNotes((previous) => new Set(previous).add(event.midi));
        playingNotes.add(event.midi);
        const releaseTask = wait(event.durationMs / speed, signal).then(() => {
          noteOff(event.midi);
          playingNotes.delete(event.midi);
        });
        releaseTasks.push(releaseTask);
      }
      await Promise.all(releaseTasks);
    } finally {
      signal.removeEventListener('abort', releaseAll);
      releaseAll();
      if (playbackController.current === controller) playbackController.current = null;
      if (mounted.current) setIsPlaying(false);
    }
  }, [isPlaying, isRecording, noteOff, speed, synth]);

  const stopPlayback = () => {
    playbackController.current?.abort();
  };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      recordingRef.current = false;
      playbackController.current?.abort();
      synth.context?.close();
    };
  }, [synth]);

  return (
    <section className={styles.piano} aria-labelledby="piano-title">
      <h2 id="piano-title">88-Key Piano</h2>
      <section className={styles.controls} aria-label="Recording controls">
        <button type="button" aria-pressed={isRecording} disabled={isPlaying} onClick={toggleRecording}>
          {isRecording ? 'Stop recording' : 'Record'}
        </button>
        <label htmlFor={speedId}>Replay speed</label>
        <select id={speedId} value={speed} disabled={isPlaying} onChange={(event) => setSpeed(Number(event.target.value))}>
          <option value="0.5">0.5×</option>
          <option value="1">1×</option>
          <option value="2">2×</option>
        </select>
        <button type="button" disabled={!sequence.length || isRecording || isPlaying} onClick={replay}>Replay</button>
        <button type="button" disabled={!isPlaying} onClick={stopPlayback}>Stop</button>
        <output aria-live="polite">{isRecording ? 'Recording' : `${sequence.length} notes recorded`}</output>
      </section>
      <section className={styles.scrollArea} role="group" aria-label="Piano keys, A0 through C8">
        <section className={styles.keyboard} role="group" aria-label="Piano keyboard">
          {KEYS.map((key) => (
            <PianoKey
              key={key.midi}
              {...key}
              isPressed={pressedNotes.has(key.midi)}
              onNoteOn={noteOn}
              onNoteOff={noteOff}
            />
          ))}
        </section>
      </section>
    </section>
  );
}
