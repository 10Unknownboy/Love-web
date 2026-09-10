export class RomanticSynth {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private noteIndex = 0;
  private startTime = 0;
  private pauseOffset = 0;
  private onTimeUpdate?: (time: number) => void;

  private static readonly MELODY = [
    { freq: 659.25, dur: 0.4 }, // E5
    { freq: 783.99, dur: 0.4 }, // G5
    { freq: 880.00, dur: 0.6 }, // A5
    { freq: 783.99, dur: 0.4 }, // G5
    { freq: 659.25, dur: 0.6 }, // E5
    { freq: 587.33, dur: 0.4 }, // D5
    { freq: 523.25, dur: 0.8 }, // C5
    { freq: 0, dur: 0.2 },      // Rest
    { freq: 587.33, dur: 0.4 }, // D5
    { freq: 659.25, dur: 0.4 }, // E5
    { freq: 783.99, dur: 0.8 }, // G5
    { freq: 659.25, dur: 0.4 }, // E5
    { freq: 587.33, dur: 0.4 }, // D5
    { freq: 523.25, dur: 1.0 }, // C5
    { freq: 0, dur: 0.4 },      // Rest
  ];

  public get duration(): number {
    return 198; // Simulated 3m 18s duration matching Birds of a Feather
  }

  public get currentTime(): number {
    if (!this.isPlaying) return this.pauseOffset;
    const elapsed = (Date.now() - this.startTime) / 1000 + this.pauseOffset;
    return elapsed % this.duration;
  }

  public start(onTimeUpdate?: (time: number) => void): void {
    if (typeof window === 'undefined') return;
    if (this.isPlaying) return;

    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!this.ctx) {
      this.ctx = new AudioContextClass();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isPlaying = true;
    this.startTime = Date.now();
    this.onTimeUpdate = onTimeUpdate;
    this.noteIndex = 0;

    this.scheduleNextNote();
  }

  private scheduleNextNote(): void {
    if (!this.isPlaying || !this.ctx) return;

    const note = RomanticSynth.MELODY[this.noteIndex % RomanticSynth.MELODY.length];
    if (note.freq > 0) {
      this.playChimeTone(note.freq, note.dur);
    }

    if (this.onTimeUpdate) {
      this.onTimeUpdate(this.currentTime);
    }

    this.noteIndex++;
    this.timerId = window.setTimeout(() => {
      this.scheduleNextNote();
    }, note.dur * 1000);
  }

  private playChimeTone(freq: number, dur: number): void {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, t);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, t);

    gainNode.gain.setValueAtTime(0.001, t);
    gainNode.gain.linearRampToValueAtTime(0.18, t + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(dur * 1.5, 0.8));

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + dur * 1.6);
    osc2.stop(t + dur * 1.6);
  }

  public stop(): void {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.pauseOffset = this.currentTime;
  }

  public seek(seconds: number): void {
    this.pauseOffset = Math.max(0, Math.min(seconds, this.duration));
    this.startTime = Date.now();
    if (this.onTimeUpdate) {
      this.onTimeUpdate(this.pauseOffset);
    }
  }
}
