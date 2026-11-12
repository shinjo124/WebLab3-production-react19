export class PolyphonicSynth {
  constructor() {
    this.context = null;
    this.masterGain = null;
    this.compressor = null;
    this.voices = new Map();
  }

  noteOn(midi, frequency = 440 * 2 ** ((midi - 69) / 12)) {
    if (this.voices.has(midi)) return;
    if (!this.context) {
      this.context = new window.AudioContext();
      this.masterGain = this.context.createGain();
      this.compressor = this.context.createDynamicsCompressor();
      this.masterGain.gain.setValueAtTime(0.4, this.context.currentTime);
      this.masterGain.connect(this.compressor).connect(this.context.destination);
    }
    const context = this.context;

    if (this.voices.size >= 8) this.noteOff(this.voices.keys().next().value);

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 0.005);
    oscillator.connect(gain).connect(this.masterGain);
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
    voice.gain.gain.setValueAtTime(Math.max(0.0001, voice.gain.gain.value), now);
    voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    voice.oscillator.stop(now + 0.04);
  }
}
