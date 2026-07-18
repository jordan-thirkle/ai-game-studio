export class Loop {
  private frameId = 0;
  private lastTime = 0;
  private lastTick = 0;
  private running = false;
  private paused = false;

  constructor(
    private readonly update: (deltaSeconds: number, elapsedSeconds: number) => void,
    private readonly render: () => void,
  ) {}

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.lastTick = this.lastTime;
    this.frameId = requestAnimationFrame(this.tick);
  }

  stop(): void {
    this.running = false;
    this.paused = false;
    cancelAnimationFrame(this.frameId);
  }

  pause(): void {
    this.paused = true;
    this.lastTick = performance.now();
  }

  resume(): void {
    if (!this.paused) return;
    this.paused = false;
    this.lastTime = performance.now();
    this.lastTick = this.lastTime;
  }

  setPausedForScreenshot(paused: boolean): void {
    if (paused) {
      this.pause();
    } else if (this.paused) {
      this.resume();
    }
  }

  private readonly tick = (time: number) => {
    if (!this.running) return;
    if (this.paused) {
      this.render();
      this.frameId = requestAnimationFrame(this.tick);
      return;
    }
    const deltaSeconds = Math.min((time - this.lastTick) / 1000, 0.05);
    this.lastTick = time;
    this.update(deltaSeconds, time / 1000);
    this.render();
    this.frameId = requestAnimationFrame(this.tick);
  };
}
