#!/usr/bin/env python3
"""
Asset Tracker — Manages the asset manifest for AI Game Studio.
Tracks 3D models, textures, audio, and reusable scripts.
"""
import json
import os
import sys
from datetime import datetime
from pathlib import Path

MANIFEST_PATH = Path(__file__).parent.parent / "metrics" / "asset-manifest.json"


def load_manifest() -> dict:
    """Load the asset manifest."""
    if MANIFEST_PATH.exists():
        with open(MANIFEST_PATH) as f:
            return json.load(f)
    return {
        "version": 1,
        "last_updated": datetime.now().isoformat(),
        "assets": {
            "models": {"description": "3D models (GLTF/GLB format)", "items": []},
            "textures": {"description": "Texture maps (PNG, JPG, HDR)", "items": []},
            "audio": {"description": "Sound effects and music", "items": []},
            "scripts": {"description": "Reusable code patterns and utilities", "items": []},
        },
        "stats": {
            "total_assets": 0,
            "total_size_kb": 0,
            "last_generated": None,
            "generation_cost_usd": 0,
        },
    }


def save_manifest(manifest: dict):
    """Save the asset manifest."""
    manifest["last_updated"] = datetime.now().isoformat()
    with open(MANIFEST_PATH, "w") as f:
        json.dump(manifest, f, indent=2)
    print(f"Manifest saved: {MANIFEST_PATH}")


def add_asset(category: str, asset_id: str, name: str, source: str, **kwargs):
    """Add an asset to the manifest."""
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
    }

    manifest["assets"][category]["items"].append(asset)
    _update_stats(manifest)
    save_manifest(manifest)
    print(f"Added: {name} to {category}")
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
            print(f"  {item['id']}: {item['name']} [{item['status']}]")
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
    print(f"Total size: {stats['total_size_kb']:.1f} KB")
    print(f"Last generated: {stats['last_generated'] or 'never'}")
    print(f"Generation cost: ${stats['generation_cost_usd']:.2f}")
    print()
    for cat, data in manifest["assets"].items():
        print(f"  {cat}: {len(data['items'])} items")


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


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: asset-tracker.py <command> [args]")
        print("Commands: list, stats, add")
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
    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)
