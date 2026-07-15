#!/usr/bin/env python3
"""
Skill Manifest Validator — Enforces lifecycle rules.
A skill cannot reach 'promoted' status without:
1. A logged trial result
2. Evidence attached
3. verification_passed = true
4. Security review if required
"""
import json
import sys
from pathlib import Path


def validate_manifest(manifest_path: str) -> dict:
    """Validate skill manifest against rules."""
    with open(manifest_path) as f:
        manifest = json.load(f)

    errors = []
    warnings = []

    for skill in manifest.get("skills", []):
        sid = skill.get("id", "unknown")
        status = skill.get("status", "unknown")

        # Rule 1: Every skill must have evidence
        if not skill.get("evidence"):
            errors.append(f"[{sid}] No evidence attached — every skill needs evidence")

        # Rule 2: Promoted skills must have trial result
        if status == "promoted":
            if not skill.get("trial_result"):
                errors.append(f"[{sid}] PROMOTED without trial_result — BLOCKED")
            if not skill.get("verification_passed"):
                errors.append(f"[{sid}] PROMOTED without verification_passed — BLOCKED")
            if not skill.get("promoted_date"):
                errors.append(f"[{sid}] PROMOTED without promoted_date")
            if skill.get("security_review_required") and not skill.get("security_review_passed"):
                errors.append(f"[{sid}] PROMOTED without security review — BLOCKED")

        # Rule 3: Trial skills must have trial target
        if status == "trial":
            if not skill.get("trial_applied_to"):
                errors.append(f"[{sid}] TRIAL without trial_applied_to")

        # Rule 4: Retired skills must have reason
        if status == "retired":
            if not skill.get("retired_date"):
                errors.append(f"[{sid}] RETIRED without retired_date")
            if not skill.get("retirement_reason"):
                errors.append(f"[{sid}] RETIRED without retirement_reason")

        # Rule 5: Cross-domain skills need scope
        if skill.get("cross_domain_candidate") and not skill.get("genre_scope"):
            warnings.append(f"[{sid}] Cross-domain candidate without genre_scope")

    return {
        "valid": len(errors) == 0,
        "errors": errors,
        "warnings": warnings,
        "skill_count": len(manifest.get("skills", [])),
        "status_counts": {
            "draft": sum(1 for s in manifest.get("skills", []) if s.get("status") == "draft"),
            "trial": sum(1 for s in manifest.get("skills", []) if s.get("status") == "trial"),
            "promoted": sum(1 for s in manifest.get("skills", []) if s.get("status") == "promoted"),
            "retired": sum(1 for s in manifest.get("skills", []) if s.get("status") == "retired"),
        },
    }


if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else "skills/manifest.json"
    result = validate_manifest(path)
    print(json.dumps(result, indent=2))
    sys.exit(0 if result["valid"] else 1)
