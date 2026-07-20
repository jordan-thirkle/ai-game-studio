import { createAmbient, AMBIENT_PRESETS } from '../../../src/lib/game-assets/audio';

export class AudioManager {
  private ambient: ReturnType<typeof createAmbient> | null = null;

  startAmbient(preset: keyof typeof AMBIENT_PRESETS = 'cave') {
    this.ambient = createAmbient(AMBIENT_PRESETS[preset]);
    this.ambient.play();
  }

  stop() {
    this.ambient?.stop();
    this.ambient?.dispose();
    this.ambient = null;
  }

  setVolume(v: number) {
    this.ambient?.setVolume(v);
  }
}
