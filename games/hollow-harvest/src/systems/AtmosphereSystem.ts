import * as THREE from 'three';

interface Firefly {
  light: THREE.PointLight;
  baseY: number;
  phase: number;
  speed: number;
  bobAmplitude: number;
}

export class AtmosphereSystem {
  private readonly fireflies: Firefly[] = [];
  private readonly group = new THREE.Group();

  constructor(scene: THREE.Scene) {
    const colors = [0x88ff44, 0x44ff88, 0xffff44];

    for (let i = 0; i < 6; i++) {
      const color = colors[i % colors.length];
      const light = new THREE.PointLight(color, 0, 3.5, 2);
      light.position.set(
        (Math.random() - 0.5) * 50,
        1 + Math.random() * 3,
        (Math.random() - 0.5) * 50,
      );
      this.group.add(light);

      this.fireflies.push({
        light,
        baseY: light.position.y,
        phase: Math.random() * Math.PI * 2,
        speed: 0.8 + Math.random() * 1.4,
        bobAmplitude: 0.15 + Math.random() * 0.3,
      });
    }

    scene.add(this.group);
  }

  update(elapsed: number): void {
    for (const ff of this.fireflies) {
      // Flicker: sine wave with second harmonic for organic feel
      const flicker =
        0.35 + 0.25 * Math.sin(elapsed * ff.speed + ff.phase) +
        0.15 * Math.sin(elapsed * ff.speed * 2.3 + ff.phase * 1.7);
      ff.light.intensity = flicker;

      // Gentle vertical bob
      ff.light.position.y = ff.baseY +
        Math.sin(elapsed * 0.6 + ff.phase) * ff.bobAmplitude;
    }
  }

  dispose(): void {
    for (const ff of this.fireflies) {
      ff.light.dispose();
    }
    this.group.clear();
  }
}
