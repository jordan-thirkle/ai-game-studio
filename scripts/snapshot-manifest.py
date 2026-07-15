#!/usr/bin/env python3
"""
Manifest Snapshotter — Creates versioned copy of manifest at build start.
Prevents race conditions in concurrent builds.
"""
import json
import shutil
import sys
from datetime import datetime
from pathlib import Path


def snapshot_manifest(manifest_path: str, output_dir: str) -> dict:
    """Create a versioned snapshot of the manifest."""
    with open(manifest_path) as f:
        manifest = json.load(f)

    version = manifest.get("version", 0)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    snapshot_name = f"manifest.v{version}.{timestamp}.json"
    snapshot_path = Path(output_dir) / snapshot_name

    snapshot_path.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(manifest_path, snapshot_path)

    return {
        "snapshot": str(snapshot_path),
        "version": version,
        "timestamp": timestamp,
        "skill_count": len(manifest.get("skills", [])),
    }


if __name__ == "__main__":
    manifest_path = sys.argv[1] if len(sys.argv) > 1 else "skills/manifest.json"
    output_dir = sys.argv[2] if len(sys.argv) > 2 else "skills/snapshots"

    result = snapshot_manifest(manifest_path, output_dir)
    print(json.dumps(result, indent=2))
