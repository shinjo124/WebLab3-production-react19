export class PolyphonicSynth {
  constructor(maxVoices = 8) {
    this.maxVoices = maxVoices;
    this.context = null;
    this.voices = new Map();
  }

  noteOn(midi) {
    if (this.voices.has(midi)) return;
    this.context ??= new window.AudioContext();
    if (this.voices.size >= this.maxVoices) this.noteOff(this.voices.keys().next().value);

    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    const frequency = 440 * 2 ** ((midi - 69) / 12);
    oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
    gain.gain.setValueAtTime(0.0001, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, this.context.currentTime + 0.02);
    oscillator.connect(gain).connect(this.context.destination);
    oscillator.start();
    this.voices.set(midi, { oscillator, gain });
  }

  noteOff(midi) {
    const voice = this.voices.get(midi);
    if (!voice) return;
    this.voices.delete(midi);
    const now = this.context.currentTime;
    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setValueAtTime(Math.max(voice.gain.gain.value, 0.0001), now);
    voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
    voice.oscillator.stop(now + 0.05);
    voice.oscillator.onended = () => {
      voice.oscillator.disconnect();
      voice.gain.disconnect();
    };
  }

  stopAll() {
    for (const midi of [...this.voices.keys()]) this.noteOff(midi);
  }

  async dispose() {
    this.stopAll();
    if (this.context && this.context.state !== 'closed') await this.context.close();
    this.context = null;
  }
}