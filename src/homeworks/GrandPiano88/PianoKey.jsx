import { memo } from 'react';

export const PianoKey = memo(function PianoKey({
  midi,
  noteName,
  isBlack = false,
  isPressed = false,
  onNoteOn,
  onNoteOff,
}) {
  return (
    <button
      type="button"
      aria-label={noteName}
      aria-pressed={isPressed}
      onPointerDown={() => onNoteOn(midi)}
      onPointerUp={() => onNoteOff(midi)}
      onPointerLeave={() => onNoteOff(midi)}
      className={isBlack ? 'piano-key piano-key--black' : 'piano-key piano-key--white'}
    >
      {noteName}
    </button>
  );
});