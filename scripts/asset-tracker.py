#!/usr/bin/env python3
"""
Asset Tracker — Manages the asset manifest for AI Game Studio.
Tracks 3D models, textures, audio, shaders, materials, scripts, animations, and UI assets.
Auto-generates documentation for the asset library.
"""
import json
import os
import sys
from datetime import datetime
from pathlib import Path

MANIFEST_PATH = Path(__file__).parent.parent / "metrics" / "asset-manifest.json"
DOCS_DIR = Path(__file__).parent.parent / "docs" / "assets"

CATEGORIES = {
    "models": {"description": "3D models (GLTF/GLB format)", "formats": ["glb", "gltf", "obj", "fbx"]},
    "textures": {"description": "Texture maps (PNG, JPG, HDR)", "formats": ["png", "jpg", "hdr", "exr"]},
    "audio": {"description": "Sound effects and music", "formats": ["mp3", "ogg", "wav"]},
    "shaders": {"description": "Vertex, fragment, compute shaders", "formats": ["glsl", "wgsl"]},
    "materials": {"description": "PBR, custom, procedural materials", "formats": ["json"]},
    "scripts": {"description": "Reusable code patterns and utilities", "formats": ["ts", "js"]},
    "animations": {"description": "Character, environment, UI animations", "formats": ["glb", "json"]},
    "ui_assets": {"description": "Icons, sprites, fonts", "formats": ["svg", "png", "woff2"]},
}


def load_manifest() -> dict:
    """Load the asset manifest."""
    if MANIFEST_PATH.exists():
        with open(MANIFEST_PATH) as f:
            return json.load(f)
    return {
        "version": 2,
        "last_updated": datetime.now().isoformat(),
        "assets": {
            cat: {"description": info["description"], "formats": info["formats"], "items": []}
            for cat, info in CATEGORIES.items()
        },
        "stats": {
            "total_assets": 0,
            "total_size_kb": 0,
            "last_generated": None,
            "generation_cost_usd": 0,
            "by_game": {},
        },
    }


def save_manifest(manifest: dict):
    """Save the asset manifest."""
    manifest["last_updated"] = datetime.now().isoformat()
    MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(MANIFEST_PATH, "w") as f:
        json.dump(manifest, f, indent=2)
    print(f"Manifest saved: {MANIFEST_PATH}")


def add_asset(category: str, asset_id: str, name: str, source: str, **kwargs):
    """Add an asset to the manifest with full documentation."""
    manifest = load_manifest()
    if category not in manifest["assets"]:
        print(f"Unknown category: {category}")
        print(f"Valid categories: {list(manifest['assets'].keys())}")
        return False

    asset = {
        "id": asset_id,
        "name": name,
        "source": source,
        "added_date": datetime.now().isoformat(),
        "status": kwargs.get("status", "active"),
        "size_kb": kwargs.get("size_kb", 0),
        "tags": kwargs.get("tags", []),
        "game_used_in": kwargs.get("game_used_in", []),
        "notes": kwargs.get("notes", ""),
        "ai_model": kwargs.get("ai_model", ""),
        "generation_prompt": kwargs.get("generation_prompt", ""),
        "license": kwargs.get("license", "cc0"),
        "resolution": kwargs.get("resolution", ""),
        "duration_seconds": kwargs.get("duration_seconds", 0),
        "polygon_count": kwargs.get("polygon_count", 0),
        "dependencies": kwargs.get("dependencies", []),
        "usage_example": kwargs.get("usage_example", ""),
    }

    manifest["assets"][category]["items"].append(asset)

    # Track by game
    for game in asset.get("game_used_in", []):
        if game not in manifest["stats"].get("by_game", {}):
            manifest["stats"].setdefault("by_game", {})[game] = []
        manifest["stats"]["by_game"][game].append(asset_id)

    _update_stats(manifest)
    save_manifest(manifest)

    # Auto-generate documentation
    _generate_asset_doc(category, asset)
    print(f"Added: {name} to {category} (+ documentation)")
    return True


def list_assets(category: str = None):
    """List all assets, optionally filtered by category."""
    manifest = load_manifest()
    if category:
        if category not in manifest["assets"]:
            print(f"Unknown category: {category}")
            return
        items = manifest["assets"][category]["items"]
        print(f"\n{category.upper()} ({len(items)} items)")
        print("-" * 40)
        for item in items:
            print(f"  {item['id']}: {item['name']} [{item['status']}] {item.get('size_kb', 0):.1f}KB")
    else:
        for cat, data in manifest["assets"].items():
            items = data["items"]
            print(f"\n{cat.upper()} ({len(items)} items)")
            print("-" * 40)
            for item in items:
                print(f"  {item['id']}: {item['name']} [{item['status']}]")
    print(f"\nTotal: {manifest['stats']['total_assets']} assets")


def show_stats():
    """Show asset statistics."""
    manifest = load_manifest()
    stats = manifest["stats"]
    print(f"\nAsset Statistics")
    print("=" * 40)
    print(f"Total assets: {stats['total_assets']}")
    print(f"Total size: {stats['total_size_kb']:.1f} KB ({stats['total_size_kb']/1024:.2f} MB)")
    print(f"Last generated: {stats['last_generated'] or 'never'}")
    print(f"Generation cost: ${stats['generation_cost_usd']:.2f}")
    print()
    for cat, data in manifest["assets"].items():
        items = data["items"]
        cat_size = sum(i.get("size_kb", 0) for i in items)
        if items:
            print(f"  {cat}: {len(items)} items ({cat_size:.1f} KB)")

    by_game = stats.get("by_game", {})
    if by_game:
        print(f"\nAssets by game:")
        for game, asset_ids in by_game.items():
            print(f"  {game}: {len(asset_ids)} assets")


def generate_all_docs():
    """Regenerate all asset documentation from manifest."""
    manifest = load_manifest()
    count = 0
    for cat, data in manifest["assets"].items():
        for item in data["items"]:
            _generate_asset_doc(cat, item)
            count += 1
    print(f"\nGenerated {count} asset docs in {DOCS_DIR}")


def _generate_asset_doc(category: str, asset: dict):
    """Auto-generate markdown documentation for a single asset."""
    DOCS_DIR.mkdir(parents=True, exist_ok=True)

    slug = asset["id"]
    doc_path = DOCS_DIR / f"{slug}.md"

    tags_str = ", ".join(asset.get("tags", []))
    games_str = ", ".join(asset.get("game_used_in", [])) or "None yet"
    deps = asset.get("dependencies", [])
    deps_str = "\n".join(f"  - {d}" for d in deps) if deps else "  None"

    resolution = asset.get("resolution", "")
    duration = asset.get("duration_seconds", 0)
    polygons = asset.get("polygon_count", 0)

    # Build specs section
    specs = []
    if resolution:
        specs.append(f"- **Resolution:** {resolution}")
    if duration:
        specs.append(f"- **Duration:** {duration}s")
    if polygons:
        specs.append(f"- **Polygon Count:** {polygons:,}")
    if asset.get("license"):
        specs.append(f"- **License:** {asset['license'].upper()}")
    specs_str = "\n".join(specs) if specs else "  N/A"

    prompt = asset.get("generation_prompt", "")
    prompt_section = f"""
## Generation Prompt

```
{prompt}
```""" if prompt else ""

    usage = asset.get("usage_example", "")
    usage_section = f"""
## Usage Example

```typescript
{usage}
```""" if usage else ""

    content = f"""---
title: "{asset['name']}"
category: "{category}"
slug: "{slug}"
source: "{asset.get('source', 'Unknown')}"
ai_model: "{asset.get('ai_model', 'Unknown')}"
license: "{asset.get('license', 'cc0')}"
size_kb: {asset.get('size_kb', 0)}
status: "{asset.get('status', 'active')}"
added: "{asset.get('added_date', '')}"
tags: [{tags_str}]
---

# {asset['name']}

{asset.get('notes', asset.get('name', ''))}

## Details

- **Category:** {category}
- **Source:** {asset.get('source', 'Unknown')}
- **AI Model:** {asset.get('ai_model', 'Unknown')}
- **File Size:** {asset.get('size_kb', 0):.1f} KB
- **Status:** {asset.get('status', 'active')}
- **Added:** {asset.get('added_date', 'Unknown')}
- **Used In:** {games_str}

## Technical Specifications

{specs_str}

## Dependencies

{deps_str}
{prompt_section}
{usage_section}

## Tags

{tags_str}
"""

    doc_path.write_text(content, encoding="utf-8")


def _update_stats(manifest: dict):
    """Update aggregate statistics."""
    total = 0
    total_size = 0
    for cat in manifest["assets"].values():
        for item in cat["items"]:
            total += 1
            total_size += item.get("size_kb", 0)
    manifest["stats"]["total_assets"] = total
    manifest["stats"]["total_size_kb"] = total_size
    manifest["stats"]["last_generated"] = datetime.now().isoformat()


def generate_sample_assets():
    """Generate sample assets to populate the library."""
    samples = [
        # 3D Models
        ("models", "oak-tree-lowpoly", "Oak Tree (Low Poly)", "ComfyUI",
         {"size_kb": 245, "tags": ["tree", "nature", "low-poly", "environment"],
          "ai_model": "Shap-E + Three.js cleanup", "polygon_count": 1200,
          "license": "cc0", "game_used_in": ["Whisperwood"],
          "generation_prompt": "Low poly stylized oak tree, autumn colors, game-ready, 1200 triangles max",
          "usage_example": "import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';\nconst loader = new GLTFLoader();\nconst gltf = await loader.loadAsync('/assets/models/oak-tree-lowpoly.glb');\nscene.add(gltf.scene);"}),
        ("models", "player-character", "Player Character", "ComfyUI",
         {"size_kb": 890, "tags": ["character", "humanoid", "hero", "animated"],
          "ai_model": "Mixamo + Three.js rigging", "polygon_count": 4500,
          "license": "cc-by", "game_used_in": ["Whisperwood", "Aetheria"],
          "generation_prompt": "Stylized fantasy adventurer, low poly, idle/walk/run animations, bone rig included"}),
        ("models", "sword-rusty", "Rusty Sword", "ComfyUI",
         {"size_kb": 120, "tags": ["weapon", "sword", "melee", "prop"],
          "ai_model": "TripoSR", "polygon_count": 800,
          "license": "cc0", "game_used_in": ["Whisperwood"],
          "generation_prompt": "Rusty medieval sword, game asset, PBR materials, single blade, worn leather grip"}),
        ("models", "stone-dungeon-wall", "Stone Dungeon Wall", "ComfyUI",
         {"size_kb": 85, "tags": ["wall", "dungeon", "stone", "modular"],
          "ai_model": "TripoSR", "polygon_count": 400,
          "license": "cc0", "game_used_in": ["Aetheria"],
          "generation_prompt": "Modular stone dungeon wall tile, seamless, PBR texture set, medieval fantasy style"}),

        # Textures
        ("textures", "forest-floor-diffuse", "Forest Floor Diffuse", "ComfyUI",
         {"size_kb": 512, "tags": ["ground", "forest", "diffuse", "seamless"],
          "ai_model": "Stable Diffusion XL", "license": "cc0",
          "resolution": "1024x1024", "game_used_in": ["Whisperwood"],
          "generation_prompt": "Seamless forest floor texture, fallen leaves, moss, dirt, top-down view, tileable",
          "usage_example": "import { TextureLoader } from 'three';\nconst loader = new TextureLoader();\nconst diffuse = await loader.loadAsync('/assets/textures/forest-floor-diffuse.png');\ndiffuse.wrapS = diffuse.wrapT = RepeatWrapping;\nmaterial.map = diffuse;"}),
        ("textures", "bark-normal-map", "Bark Normal Map", "ComfyUI",
         {"size_kb": 384, "tags": ["bark", "tree", "normal", "seamless"],
          "ai_model": "Materialize", "license": "cc0",
          "resolution": "1024x1024", "game_used_in": ["Whisperwood"]}),
        ("textures", "stone-brick-roughness", "Stone Brick Roughness", "ComfyUI",
         {"size_kb": 256, "tags": ["stone", "brick", "roughness", "seamless"],
          "ai_model": "Materialize", "license": "cc0",
          "resolution": "512x512", "game_used_in": ["Aetheria"]}),
        ("textures", "sky-hdri-sunset", "Sunset Sky HDRI", "ComfyUI",
         {"size_kb": 4096, "tags": ["sky", "hdri", "sunset", "environment"],
          "ai_model": "Polyhaven API", "license": "cc0",
          "resolution": "2048x1024", "game_used_in": ["Whisperwood", "Aetheria"]}),

        # Audio
        ("audio", "footstep-grass", "Grass Footstep SFX", "Suno",
         {"size_kb": 45, "tags": ["footstep", "grass", "walk", "foley"],
          "ai_model": "ElevenLabs SFX", "license": "cc0",
          "duration_seconds": 2.5, "game_used_in": ["Whisperwood"],
          "generation_prompt": "Single footstep on grass, foley recording, clean, no reverb",
          "usage_example": "import { AudioLoader, Audio } from 'three';\nconst loader = new AudioLoader();\nconst buffer = await loader.loadAsync('/assets/audio/footstep-grass.ogg');\nconst sound = new Audio(listener);\nsound.setBuffer(buffer);"}),
        ("audio", "ambient-forest", "Forest Ambience", "Suno",
         {"size_kb": 890, "tags": ["ambient", "forest", "nature", "loop"],
          "ai_model": "Suno v4", "license": "cc0",
          "duration_seconds": 60, "game_used_in": ["Whisperwood"]}),
        ("audio", "sword-clash", "Sword Clash SFX", "Suno",
         {"size_kb": 32, "tags": ["combat", "sword", "clash", "metal"],
          "ai_model": "ElevenLabs SFX", "license": "cc0",
          "duration_seconds": 1.2, "game_used_in": ["Whisperwood", "Aetheria"]}),
        ("audio", "main-theme", "Whisperwood Main Theme", "Suno",
         {"size_kb": 3200, "tags": ["music", "theme", "orchestral", "fantasy"],
          "ai_model": "Suno v4", "license": "cc-by",
          "duration_seconds": 180, "game_used_in": ["Whisperwood"],
          "generation_prompt": "Fantasy orchestral theme, magical forest, flutes and strings, 120 BPM, ethereal"}),

        # Shaders
        ("shaders", "dissolve-effect", "Dissolve Shader", "Claude",
         {"size_kb": 4, "tags": ["shader", "dissolve", "effect", "fragment"],
          "ai_model": "Claude 3.5 Sonnet", "license": "mit",
          "game_used_in": ["Whisperwood", "Aetheria"],
          "usage_example": "const material = new ShaderMaterial({\n  uniforms: { threshold: { value: 0.0 }, color: { value: new Color(0x4a8a3a) } },\n  vertexShader: dissolveVertex,\n  fragmentShader: dissolveFragment,\n});"}),
        ("shaders", "water-reflective", "Water Surface Shader", "Claude",
         {"size_kb": 6, "tags": ["shader", "water", "reflective", "animated"],
          "ai_model": "Claude 3.5 Sonnet", "license": "mit",
          "game_used_in": ["Whisperwood"]}),

        # Materials
        ("materials", "pbr-forest-ground", "Forest Ground PBR", "Three.js",
         {"size_kb": 2, "tags": ["material", "pbr", "ground", "forest"],
          "ai_model": "Three.js procedural", "license": "mit",
          "game_used_in": ["Whisperwood"],
          "usage_example": "const material = new MeshStandardMaterial({\n  map: forestDiffuse,\n  normalMap: forestNormal,\n  roughnessMap: forestRoughness,\n  roughness: 0.9,\n});"}),

        # Scripts
        ("scripts", "procedural-tree-gen", "Procedural Tree Generator", "Claude",
         {"size_kb": 8, "tags": ["procedural", "tree", "generator", "l-system"],
          "ai_model": "Claude 3.5 Sonnet", "license": "mit",
          "game_used_in": ["Whisperwood"],
          "usage_example": "import { generateTree } from './procedural-tree-gen';\nconst tree = generateTree({ seed: 42, height: 5, branches: 4, leafDensity: 0.8 });\nscene.add(tree);"}),
        ("scripts", "camera-follow", "Smart Camera Follow", "Claude",
         {"size_kb": 5, "tags": ["camera", "follow", "smooth", "lookahead"],
          "ai_model": "Claude 3.5 Sonnet", "license": "mit",
          "game_used_in": ["Whisperwood", "Aetheria", "Neon Drift"]}),

        # Animations
        ("animations", "character-idle-breathe", "Idle Breathing Animation", "ComfyUI",
         {"size_kb": 45, "tags": ["animation", "idle", "breathe", "character"],
          "ai_model": "Mixamo", "license": "cc0",
          "game_used_in": ["Whisperwood"]}),

        # UI Assets
        ("ui_assets", "health-bar-hud", "Health Bar HUD Element", "Claude",
         {"size_kb": 3, "tags": ["ui", "hud", "health", "bar"],
          "ai_model": "Claude + SVG", "license": "mit",
          "game_used_in": ["Whisperwood", "Aetheria"],
          "usage_example": "// React component for health bar\nfunction HealthBar({ current, max }: { current: number; max: number }) {\n  return (\n    <div className=\"health-bar\">\n      <div className=\"health-fill\" style={{ width: `${(current/max)*100}%` }} />\n    </div>\n  );\n}"}),
        ("ui_assets", "icon-sword-svg", "Sword Icon (SVG)", "Claude",
         {"size_kb": 1, "tags": ["icon", "svg", "weapon", "ui"],
          "ai_model": "Claude + SVG", "license": "cc0",
          "game_used_in": ["Whisperwood"]}),
    ]

    print(f"Adding {len(samples)} sample assets...")
    for cat, asset_id, name, source, kwargs in samples:
        add_asset(cat, asset_id, name, source, **kwargs)
    print(f"\nDone! Generated docs in {DOCS_DIR}")


def _update_stats(manifest: dict):
    """Update aggregate statistics."""
    total = 0
    total_size = 0
    for cat in manifest["assets"].values():
        for item in cat["items"]:
            total += 1
            total_size += item.get("size_kb", 0)
    manifest["stats"]["total_assets"] = total
    manifest["stats"]["total_size_kb"] = total_size
    manifest["stats"]["last_generated"] = datetime.now().isoformat()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: asset-tracker.py <command> [args]")
        print("Commands:")
        print("  list [category]       List all assets")
        print("  stats                 Show asset statistics")
        print("  add <cat> <id> <name> <source>  Add an asset")
        print("  docs                  Regenerate all documentation")
        print("  samples               Add sample assets for demo")
        sys.exit(1)

    cmd = sys.argv[1]
    if cmd == "list":
        category = sys.argv[2] if len(sys.argv) > 2 else None
        list_assets(category)
    elif cmd == "stats":
        show_stats()
    elif cmd == "add":
        if len(sys.argv) < 6:
            print("Usage: asset-tracker.py add <category> <id> <name> <source>")
            sys.exit(1)
        add_asset(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5])
    elif cmd == "docs":
        generate_all_docs()
    elif cmd == "samples":
        generate_sample_assets()
    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)
