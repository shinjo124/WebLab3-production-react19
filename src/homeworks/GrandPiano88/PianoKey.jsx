export function PianoKey({ note = 'A0', isPressed = false }) {
  return <button type="button" aria-pressed={isPressed}>{note}</button>;
}