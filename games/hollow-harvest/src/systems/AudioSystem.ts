export class AudioSystem {
  private context: AudioContext | null = null;
  private unlocked = false;
  private ambientNodes: { osc1: OscillatorNode; osc2: OscillatorNode; lfo: OscillatorNode; gain: GainNode } | null = null;

  constructor() {
    const unlock = () => {
      void this.unlock();
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
  }

  async unlock(): Promise<void> {
    if (this.unlocked) return;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    this.context = new AudioContextClass();
    await this.context.resume();
    this.unlocked = true;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'triangle',
    volume = 0.06,
    ramp?: { to: number; time: number },
  ): void {
    if (!this.context || this.context.state !== 'running') return;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    const now = this.context.currentTime;

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (ramp) {
      osc.frequency.exponentialRampToValueAtTime(ramp.to, now + ramp.time);
    }

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain).connect(this.context.destination);
    osc.start(now);
    osc.stop(now + duration + 0.01);
  }

  playerShoot(): void {
    this.playTone(680, 0.08, 'square', 0.03, { to: 340, time: 0.06 });
  }

  playerHit(): void {
    this.playTone(180, 0.12, 'sawtooth', 0.05, { to: 100, time: 0.1 });
  }

  enemyHit(): void {
    this.playTone(440, 0.05, 'triangle', 0.03, { to: 220, time: 0.04 });
  }

  enemyDeath(): void {
    this.playTone(320, 0.15, 'triangle', 0.04, { to: 120, time: 0.12 });
    setTimeout(() => {
      this.playTone(240, 0.1, 'sine', 0.03, { to: 80, time: 0.08 });
    }, 50);
  }

  pickup(index: number): void {
    this.playTone(
      320 + index * 22,
      0.18,
      'triangle',
      0.06,
      { to: 680 + index * 24, time: 0.12 },
    );
  }

  levelUp(): void {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.2, 'triangle', 0.05);
      }, i * 80);
    });
  }

  upgradeSelect(): void {
    this.playTone(880, 0.15, 'sine', 0.04, { to: 1320, time: 0.1 });
  }

  bossSpawn(): void {
    this.playTone(80, 0.5, 'sawtooth', 0.06, { to: 60, time: 0.4 });
    setTimeout(() => {
      this.playTone(100, 0.4, 'square', 0.04, { to: 50, time: 0.3 });
    }, 200);
  }

  bossDeath(): void {
    const notes = [392, 494, 587, 784, 988];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.3, 'triangle', 0.05);
      }, i * 100);
    });
  }

  charge(): void {
    this.playTone(120, 0.3, 'sawtooth', 0.05, { to: 200, time: 0.25 });
  }

  aoe(): void {
    this.playTone(60, 0.4, 'sawtooth', 0.06, { to: 40, time: 0.3 });
  }

  playerDeath(): void {
    const notes = [523, 440, 349, 262, 196];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.4, 'triangle', 0.05);
      }, i * 150);
    });
  }

  dispose(): void {
    this.stopAmbient();
    void this.context?.close();
    this.context = null;
  }

  startAmbient(): void {
    this.stopAmbient();
    if (!this.context || this.context.state !== 'running') return;

    const now = this.context.currentTime;

    // Two detuned sine oscillators for a warm pad
    const osc1 = this.context.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(130, now); // C3

    const osc2 = this.context.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(196, now); // G3

    // LFO for gentle volume movement
    const lfo = this.context.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.15, now);

    const lfoGain = this.context.createGain();
    lfoGain.gain.setValueAtTime(0.003, now);

    const gain = this.context.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.035, now + 2);

    lfo.connect(lfoGain).connect(gain.gain);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.context.destination);

    osc1.start(now);
    osc2.start(now);
    lfo.start(now);

    this.ambientNodes = { osc1, osc2, lfo, gain };
  }

  stopAmbient(): void {
    if (!this.ambientNodes) return;
    const now = this.context?.currentTime ?? 0;
    this.ambientNodes.gain.gain.linearRampToValueAtTime(0, now + 0.5);
    const nodes = this.ambientNodes;
    setTimeout(() => {
      try { nodes.osc1.stop(); } catch { /* already stopped */ }
      try { nodes.osc2.stop(); } catch { /* already stopped */ }
      try { nodes.lfo.stop(); } catch { /* already stopped */ }
    }, 600);
    this.ambientNodes = null;
  }
}
