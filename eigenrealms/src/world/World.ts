import * as THREE from "three";

export class World {
  public readonly group: THREE.Group;

  private readonly scene: THREE.Scene;
  private readonly materials: THREE.Material[] = [];

  public constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = "World";

    scene.add(this.group);

    this.createLighting();
    this.createTerrain();
    this.createForest();
    this.createMist();
  }

  public getHeight(x: number, z: number): number {
    const broad =
      Math.sin(x * 0.045) * 0.7 +
      Math.cos(z * 0.038) * 0.55 +
      Math.sin((x + z) * 0.018) * 0.35;

    const detail =
      Math.sin(x * 0.13 + z * 0.07) * 0.12 +
      Math.cos(z * 0.16 - x * 0.04) * 0.08;

    return broad + detail;
  }

  public dispose(): void {
    this.group.traverse((object) => {
      const mesh = object as THREE.Mesh;

      if (mesh.geometry) {
        mesh.geometry.dispose();
      }

      if (mesh.material) {
        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];

        for (const material of materials) {
          material.dispose();
        }
      }
    });

    for (const material of this.materials) {
      material.dispose();
    }

    this.scene.remove(this.group);
  }

  private createLighting(): void {
    const ambient = new THREE.HemisphereLight(0x9bb8ad, 0x101a12, 1.6);
    ambient.name = "Forest Ambient Light";
    this.scene.add(ambient);

    const moon = new THREE.DirectionalLight(0xb8d0c5, 2.2);
    moon.name = "Moonlight";
    moon.position.set(-35, 55, 20);
    moon.castShadow = true;
    moon.shadow.mapSize.set(2048, 2048);
    moon.shadow.camera.left = -70;
    moon.shadow.camera.right = 70;
    moon.shadow.camera.top = 70;
    moon.shadow.camera.bottom = -70;
    moon.shadow.camera.near = 1;
    moon.shadow.camera.far = 160;
    moon.shadow.bias = -0.0005;
    this.scene.add(moon);

    const greenFill = new THREE.PointLight(0x4c9a68, 10, 35, 2);
    greenFill.position.set(0, 5, 0);
    this.scene.add(greenFill);
  }

  private createTerrain(): void {
    const size = 240;
    const segments = 96;
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    const positions = geometry.attributes.position;

    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      const z = -positions.getY(index);
      positions.setZ(index, this.getHeight(x, z));
    }

    geometry.computeVertexNormals();
    geometry.rotateX(-Math.PI / 2);

    const material = new THREE.MeshStandardMaterial({
      color: 0x172c1d,
      roughness: 1,
      metalness: 0,
    });

    this.materials.push(material);

    const terrain = new THREE.Mesh(geometry, material);
    terrain.name = "Forest Floor";
    terrain.receiveShadow = true;
    this.group.add(terrain);

    const undergrowth = new THREE.Mesh(
      new THREE.PlaneGeometry(size * 1.4, size * 1.4),
      new THREE.MeshBasicMaterial({ color: 0x050b08 }),
    );
    undergrowth.rotation.x = -Math.PI / 2;
    undergrowth.position.y = -1.5;
    this.group.add(undergrowth);
  }

  private createForest(): void {
    const random = this.seededRandom(7919);
    const trunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x241b16,
      roughness: 1,
    });
    const foliageMaterial = new THREE.MeshStandardMaterial({
      color: 0x10291c,
      roughness: 1,
    });

    this.materials.push(trunkMaterial, foliageMaterial);

    for (let index = 0; index < 115; index += 1) {
      const angle = random() * Math.PI * 2;
      const radius = 18 + random() * 91;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      if (Math.abs(x) < 8 && Math.abs(z) < 8) {
        continue;
      }

      this.createTree(x, z, 0.75 + random() * 1.2, trunkMaterial, foliageMaterial);
    }
  }

  private createTree(
    x: number,
    z: number,
    scale: number,
    trunkMaterial: THREE.Material,
    foliageMaterial: THREE.Material,
  ): void {
    const tree = new THREE.Group();
    tree.position.set(x, this.getHeight(x, z), z);
    tree.scale.setScalar(scale);

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.38, 4.2, 7),
      trunkMaterial,
    );
    trunk.position.y = 2.1;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    tree.add(trunk);

    const lowerCanopy = new THREE.Mesh(
      new THREE.ConeGeometry(2.25, 3.8, 8),
      foliageMaterial,
    );
    lowerCanopy.position.y = 4.3;
    lowerCanopy.castShadow = true;
    tree.add(lowerCanopy);

    const upperCanopy = new THREE.Mesh(
      new THREE.ConeGeometry(1.65, 3.1, 8),
      foliageMaterial,
    );
    upperCanopy.position.y = 6.3;
    upperCanopy.castShadow = true;
    tree.add(upperCanopy);

    this.group.add(tree);
  }

  private createMist(): void {
    const mist = new THREE.FogExp2(0x07100d, 0.018);
    this.scene.fog = mist;

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(1, 16, 16),
      new THREE.MeshBasicMaterial({
        color: 0x6baf88,
        transparent: true,
        opacity: 0.08,
      }),
    );
    glow.position.set(-18, 4, -24);
    glow.scale.set(18, 5, 18);
    this.group.add(glow);
  }

  private seededRandom(seed: number): () => number {
    let value = seed;

    return () => {
      value = (value * 1664525 + 1013904223) % 4294967296;
      return value / 4294967296;
    };
  }
}