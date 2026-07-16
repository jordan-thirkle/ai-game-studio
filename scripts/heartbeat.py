#!/usr/bin/env python3
"""
Eigen Heartbeat Monitor
Checks all Eigen sites and reports status.
"""
import subprocess
import json
from datetime import datetime

SITES = [
    {"name": "Eigen Studio", "url": "https://ai-game-studio-one.vercel.app"},
    {"name": "Whisperwood", "url": "https://whisperwood-v2.vercel.app"},
    {"name": "Aetheria", "url": "https://aetheria.vercel.app"},
]

def check_site(url: str) -> dict:
    """Check if a site is responding."""
    try:
        result = subprocess.run(
            ["curl", "-s", "-o", "/dev/null", "-w", "%{http_code},%{time_total}", url],
            capture_output=True, text=True, timeout=15
        )
        parts = result.stdout.strip().split(",")
        status_code = int(parts[0]) if parts else 0
        response_time = float(parts[1]) if len(parts) > 1 else 0
        return {
            "status": "up" if 200 <= status_code < 400 else "down",
            "status_code": status_code,
            "response_time_ms": round(response_time * 1000),
        }
    except Exception as e:
        return {"status": "error", "status_code": 0, "response_time_ms": 0, "error": str(e)}

def main():
    results = []
    all_healthy = True

    for site in SITES:
        result = check_site(site["url"])
        results.append({**site, **result})
        if result["status"] != "up":
            all_healthy = False

    # Build output
    lines = []
    lines.append("=== Eigen Heartbeat ===")
    lines.append(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S UTC')}")
    lines.append("")

    for r in results:
        status_icon = "OK" if r["status"] == "up" else "DOWN"
        lines.append(f"  {r['name']}: {status_icon} ({r['status_code']}) {r['response_time_ms']}ms")

    lines.append("")

    if all_healthy:
        lines.append("All systems operational.")
        # Silent — don't notify on healthy status
        return ""

    # Report issues
    lines.append("ALERT: One or more sites are down!")
    for r in results:
        if r["status"] != "up":
            lines.append(f"  - {r['name']}: {r['status']} ({r['status_code']})")

    return "\n".join(lines)

if __name__ == "__main__":
    output = main()
    if output:
        print(output)
