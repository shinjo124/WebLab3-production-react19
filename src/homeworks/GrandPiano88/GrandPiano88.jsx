import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { PianoKey } from './PianoKey.jsx';
import { PolyphonicSynth } from './PolyphonicSynth.js';

const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const BLACK_NOTES = new Set([1, 3, 6, 8, 10]);

function waitFor(ms, signal) {
  return new Promise((resolve, reject) => {
    let timerId;
    const cleanup = () => signal.removeEventListener('abort', onAbort);
    const onAbort = () => {
      window.clearTimeout(timerId);
      cleanup();
      const error = new Error('Playback stopped.');
      error.name = 'AbortError';
      reject(error);
    };
    if (signal.aborted) {
      onAbort();
      return;
    }
    timerId = window.setTimeout(() => {
      cleanup();
      resolve();
    }, ms);
    signal.addEventListener('abort', onAbort, { once: true });
  });
}

export function GrandPiano88() {
  const synth = useMemo(() => new PolyphonicSynth(8), []);
  const [pressed, setPressed] = useState(() => new Set());
  const [recording, setRecording] = useState(false);
  const [speed, setSpeed] = useState('1');
  const [sequenceLength, setSequenceLength] = useState(0);
  const speedId = useId();
  const sequence = useRef([]);
  const recordStart = useRef(0);
  const playbackController = useRef(null);
  const keys = useMemo(() => Array.from({ length: 88 }, (_, index) => {
    const midi = index + 21;
    const pitch = midi % 12;
    return { midi, noteName: `${NOTE_NAMES[pitch]}${Math.floor(midi / 12) - 1}`, isBlack: BLACK_NOTES.has(pitch) };
  }), []);

  const recordEvent = useCallback((type, midi) => {
    if (!recording) return;
    sequence.current.push({ type, midi, atMs: performance.now() - recordStart.current });
    setSequenceLength(sequence.current.length);
  }, [recording]);
  const noteOn = useCallback((midi) => {
    synth.noteOn(midi);
    setPressed((current) => new Set(current).add(midi));
  }, [synth]);
  const noteOff = useCallback((midi) => {
    synth.noteOff(midi);
    setPressed((current) => {
      const next = new Set(current);
      next.delete(midi);
      return next;
    });
  }, [synth]);

  const handleNoteOn = useCallback((midi) => { noteOn(midi); recordEvent('on', midi); }, [noteOn, recordEvent]);
  const handleNoteOff = useCallback((midi) => { noteOff(midi); recordEvent('off', midi); }, [noteOff, recordEvent]);

  const startRecording = () => {
    sequence.current = [];
    setSequenceLength(0);
    recordStart.current = performance.now();
    setRecording(true);
  };
  const playSequence = async () => {
    if (!sequence.current.length) return;
    playbackController.current?.abort();
    const controller = new AbortController();
    playbackController.current = controller;
    let previousAt = 0;
    try {
      for (const event of sequence.current) {
        await waitFor((event.atMs - previousAt) / Number(speed), controller.signal);
        previousAt = event.atMs;
        if (event.type === 'on') noteOn(event.midi);
        else noteOff(event.midi);
      }
    } catch (error) {
      if (error.name !== 'AbortError') throw error;
    } finally {
      if (playbackController.current === controller) playbackController.current = null;
    }
  };
  const stopSequence = () => {
    playbackController.current?.abort();
    playbackController.current = null;
    synth.stopAll();
    setPressed(new Set());
  };

  useEffect(() => () => {
    playbackController.current?.abort();
    void synth.dispose();
  }, [synth]);

  return (
    <section aria-label="88-key polyphonic piano">
      <p>88 generated notes, A0 to C8. Up to eight voices play at once.</p>
      <div>
        <button type="button" aria-pressed={recording} onClick={() => recording ? setRecording(false) : startRecording()}>
          {recording ? 'Stop recording' : 'Record'}
        </button>
        <button type="button" onClick={playSequence} disabled={!sequenceLength}>Play sequence</button>
        <button type="button" onClick={stopSequence}>Stop sequence</button>
        <label htmlFor={speedId}>Playback speed</label>
        <select id={speedId} value={speed} onChange={(event) => setSpeed(event.target.value)}>
          <option value="0.5">0.5×</option><option value="1">1×</option><option value="2">2×</option>
        </select>
      </div>
      <ol>
        {keys.map((key) => (
          <li key={key.midi}>
            <PianoKey
              {...key}
              isPressed={pressed.has(key.midi)}
              onNoteOn={handleNoteOn}
              onNoteOff={handleNoteOff}
            />
          </li>
        ))}
      </ol>
      <output aria-live="polite">Recorded events: {sequenceLength}</output>
    </section>
  );
}