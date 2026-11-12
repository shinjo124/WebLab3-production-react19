export class PolyphonicSynth {
  constructor() {
    this.context = null;
    this.voices = new Map();
  }

  noteOn(midi, frequency = 440 * 2 ** ((midi - 69) / 12)) {
    if (this.voices.has(midi)) return;
    const context = this.context ??= new window.AudioContext();

    if (this.voices.size >= 8) this.noteOff(this.voices.keys().next().value);

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.2, now);
    oscillator.connect(gain).connect(context.destination);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
    oscillator.start(now);
    this.voices.set(midi, { oscillator, gain });
  }

  noteOff(midi) {
    const voice = this.voices.get(midi);
    if (!voice) return;

    this.voices.delete(midi);
    const now = this.context.currentTime;
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(voice.gain.gain.value, now);
    voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    voice.oscillator.stop(now + 0.04);
  }
}
