#!/usr/bin/env python3
"""
Context Budget Manager — Tracks and limits token usage per agent invocation.
Prevents context rot: quality degrades when context grows too large.
"""
import json
import sys
from datetime import datetime
from pathlib import Path


# Default budget per agent invocation
DEFAULT_TOKEN_BUDGET = 50000  # 50k tokens
WARNING_THRESHOLD = 0.8       # Warn at 80%
RESET_THRESHOLD = 0.95        # Reset at 95%


def estimate_tokens(text: str) -> int:
    """Rough token estimate: ~4 chars per token for English."""
    return len(text) // 4


def check_budget(agent_id: str, context: str, budget: int = DEFAULT_TOKEN_BUDGET) -> dict:
    """Check if agent context is within budget."""
    tokens_used = estimate_tokens(context)
    usage_pct = tokens_used / budget

    status = "ok"
    if usage_pct >= RESET_THRESHOLD:
        status = "reset_required"
    elif usage_pct >= WARNING_THRESHOLD:
        status = "warning"

    return {
        "agent_id": agent_id,
        "tokens_used": tokens_used,
        "token_budget": budget,
        "usage_percent": round(usage_pct * 100, 1),
        "status": status,
        "action": "proceed" if status == "ok" else "summarize_and_reset" if status == "reset_required" else "monitor",
    }


def log_usage(agent_id: str, result: dict, log_path: str = "metrics/context-usage.json"):
    """Append usage to log file."""
    log_file = Path(log_path)
    log_file.parent.mkdir(parents=True, exist_ok=True)

    entries = []
    if log_file.exists():
        with open(log_file) as f:
            entries = json.load(f)

    entries.append({
        "timestamp": datetime.now().isoformat(),
        "agent_id": agent_id,
        "tokens_used": result["tokens_used"],
        "usage_percent": result["usage_percent"],
        "status": result["status"],
    })

    # Keep last 100 entries
    entries = entries[-100:]

    with open(log_file, "w") as f:
        json.dump(entries, f, indent=2)


if __name__ == "__main__":
    agent_id = sys.argv[1] if len(sys.argv) > 1 else "unknown"
    context_file = sys.argv[2] if len(sys.argv) > 2 else None
    budget = int(sys.argv[3]) if len(sys.argv) > 3 else DEFAULT_TOKEN_BUDGET

    if context_file:
        with open(context_file) as f:
            context = f.read()
    else:
        context = sys.stdin.read()

    result = check_budget(agent_id, context, budget)
    log_usage(agent_id, result)

    print(json.dumps(result, indent=2))

    if result["status"] == "reset_required":
        print(f"\n⚠️ CONTEXT BUDGET EXCEEDED ({result['usage_percent']}%)")
        print("Action required: summarize context and reset")
        sys.exit(1)
    elif result["status"] == "warning":
        print(f"\n⚠️ Context approaching budget ({result['usage_percent']}%)")
        sys.exit(0)
    else:
        print(f"\n✅ Context within budget ({result['usage_percent']}%)")
        sys.exit(0)
