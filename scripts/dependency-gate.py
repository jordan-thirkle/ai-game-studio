#!/usr/bin/env python3
"""
Dependency Gate — Checks package existence and reputation before install.
Prevents slopsquatting: hallucinated package names that attackers pre-register.
"""
import json
import subprocess
import sys


def check_package(package_name: str) -> dict:
    """Check if a package exists and has reasonable reputation."""
    # Step 1: Check if package exists on npm
    result = subprocess.run(
        ["npm", "view", package_name, "name", "version", "description", "time.modified", "maintainers", "--json"],
        capture_output=True, text=True, timeout=15, shell=True
    )

    if result.returncode != 0:
        return {
            "package": package_name,
            "exists": False,
            "safe_to_install": False,
            "reason": "Package not found on npm registry",
        }

    try:
        data = json.loads(result.stdout)
    except json.JSONDecodeError:
        return {
            "package": package_name,
            "exists": False,
            "safe_to_install": False,
            "reason": "Failed to parse npm response",
        }

    # Step 2: Check modification date (brand-new packages are risky)
    modified = data.get("time", {}).get("modified", "")
    if modified:
        from datetime import datetime
        try:
            mod_date = datetime.fromisoformat(modified.replace("Z", "+00:00"))
            days_old = (datetime.now(mod_date.tzinfo) - mod_date).days
            if days_old < 30:
                return {
                    "package": package_name,
                    "exists": True,
                    "safe_to_install": False,
                    "reason": f"Package only {days_old} days old — too new",
                    "modified": modified,
                    "version": data.get("version"),
                }
        except (ValueError, TypeError):
            pass

    # Step 3: Check maintainers (no maintainers is suspicious)
    maintainers = data.get("maintainers", [])
    if not maintainers:
        return {
            "package": package_name,
            "exists": True,
            "safe_to_install": False,
            "reason": "No maintainers listed — suspicious",
            "version": data.get("version"),
        }

    return {
        "package": package_name,
        "exists": True,
        "safe_to_install": True,
        "reason": "Package exists, has maintainers, is not brand-new",
        "version": data.get("version"),
        "description": data.get("description", "")[:100],
        "modified": modified,
        "maintainers": [m if isinstance(m, str) else m.get("name", "unknown") for m in maintainers[:3]],
    }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: dependency-gate.py <package1> [package2] ...")
        sys.exit(1)

    results = []
    for pkg in sys.argv[1:]:
        result = check_package(pkg)
        results.append(result)
        status = "✅ SAFE" if result["safe_to_install"] else "❌ BLOCKED"
        print(f"{status} — {pkg}: {result['reason']}")

    # Overall verdict
    blocked = [r for r in results if not r["safe_to_install"]]
    if blocked:
        print(f"\n❌ {len(blocked)} package(s) blocked. Do not install without manual review.")
        sys.exit(1)
    else:
        print(f"\n✅ All {len(results)} package(s) cleared for installation.")
        sys.exit(0)
