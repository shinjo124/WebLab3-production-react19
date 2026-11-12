import { memo } from 'react';
import styles from './PianoKey.module.css';

export const PianoKey = memo(function PianoKey({ midi, note, isBlack, isPressed, onNoteOn, onNoteOff }) {
  const release = () => onNoteOff(midi);

  return (
    <button
      type="button"
      className={`${styles.key} ${isBlack ? styles.black : styles.white} ${isPressed ? styles.pressed : ''}`}
      aria-label={`${note}, MIDI ${midi}`}
      aria-pressed={isPressed}
      onPointerDown={() => onNoteOn(midi)}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
      onBlur={release}
      onKeyDown={(event) => {
        if ((event.code === 'Space' || event.code === 'Enter') && !event.repeat) {
          event.preventDefault();
          onNoteOn(midi);
        }
      }}
      onKeyUp={(event) => {
        if (event.code === 'Space' || event.code === 'Enter') {
          event.preventDefault();
          release();
        }
      }}
    >
      <span>{note}</span>
    </button>
  );
});
