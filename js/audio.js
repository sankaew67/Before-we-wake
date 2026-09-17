/**
 * Original synthesized ambience: no external sound files or autoplay.
 * Rain / wind and sparse warm notes crossfade with the scene.
 */
export class Ambience {
  constructor() {
    this.enabled = false;
    this.mood = 'rain';
    this.context = null;
    this.timer = null;
  }

  async enable() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return false;
    if (!this.context) this.create(AudioContext);
    await this.context.resume();
    this.enabled = true;
    this.master.gain.setTargetAtTime(0.28, this.context.currentTime, 0.7);
    this.setMood(this.mood);
    clearInterval(this.timer);
    this.timer = setInterval(() => this.playNote(), 7500);
    return true;
  }

  disable() {
    this.enabled = false;
    clearInterval(this.timer);
    if (this.context) this.master.gain.setTargetAtTime(0, this.context.currentTime, 0.15);
  }

  create(AudioContext) {
    const context = this.context = new AudioContext();
    this.master = context.createGain();
    this.master.gain.value = 0;
    this.master.connect(context.destination);

    const buffer = context.createBuffer(1, context.sampleRate * 4, context.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      last = (last + (Math.random() * 2 - 1) * 0.025) / 1.025;
      data[i] = last * 5;
    }
    const noise = context.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    this.filter = context.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.noiseGain = context.createGain();
    noise.connect(this.filter).connect(this.noiseGain).connect(this.master);
    noise.start();
  }

  setMood(mood) {
    this.mood = mood;
    if (!this.context) return;
    const rainy = mood === 'rain' || mood === 'night';
    const time = this.context.currentTime;
    this.filter.frequency.setTargetAtTime(rainy ? 2200 : 480, time, 1.8);
    this.noiseGain.gain.setTargetAtTime(rainy ? 0.75 : 0.25, time, 1.8);
  }

  playNote() {
    if (!this.enabled || document.hidden || ['rain', 'night'].includes(this.mood)) return;
    const context = this.context;
    const notes = this.mood === 'farewell' ? [261.63, 329.63, 392] : [293.66, 392, 440, 587.33];
    const frequency = notes[Math.floor(Math.random() * notes.length)];
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    const now = context.currentTime;
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(0.09, now + 0.7);
    envelope.gain.exponentialRampToValueAtTime(0.001, now + 4.5);
    oscillator.connect(envelope).connect(this.master);
    oscillator.start(now);
    oscillator.stop(now + 5);
    oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
  }

  async setVisibility(hidden) {
    if (!this.context || !this.enabled) return;
    try {
      if (hidden) await this.context.suspend();
      else await this.context.resume();
    } catch { /* Browser may require the sound button after interruption. */ }
  }
}
