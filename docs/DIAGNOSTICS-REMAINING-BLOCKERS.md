# DIAGNOSTICS — Remaining Blockers
_Last run: 2026-07-18_

## FIXED SINCE LAST STATE
- `scripts/merge_bridge.py` is present at `D:/Projects/active/ai-game-studio/scripts/merge_bridge.py`.
- Profile `gta6-hub` and gateway are running; active route is healthy.

## REMAINING BLOCKERS

1. **Model slug / provider mismatch**
   - `config.yaml` sets `model: openai/gpt-5.6-luna` with provider `merge-gateway`.
   - Doctor flags this as invalid because vendor-prefixed slugs belong to aggregators such as OpenRouter, not merge-gateway.
   - Fix: either change the slug to a bare model name for `merge-gateway`, or switch provider to `openrouter`.

2. **Bun is not in PATH for this shell / Hermes processes**
   - `gbrain.exe` exists at `C:\Users\jorda\.bun\bin\gbrain.exe`.
   - `gbrain` invocation errors with: `bun is not installed in %PATH%`.
   - gBrain MCP registration is not visible under Hermes config/memories.
   - Fix: append `C:\Users\jorda\.bun\bin` to PATH, then rerun `hermes doctor` and re-register gBrain MCP if needed.

3. **gBrain MCP tool registration is missing**
   - Despite the stated intent, gBrain is not present in Hermes/Tool Availability and no MCP registration entry was found.
   - This is likely a side-effect of gitignored/bun-exe path flow rather than gBrain itself.
   - Fix after re-added PATH and confirming `gbrain doctor` succeeds: install/register gBrain MCP under this profile.

4. **Telegram delivery not independently verified in this pass**
   - Telegram is not explicitly shown in `config.yaml` review, though presence was implied in the provided context.
   - Until Telegram delivery is tested at runtime from the active profile, it remains effectively blocked from a "perfect studio" standpoint.
   - Fix: run a test notice through Telegram and confirm delivery.

5. **Cron job `eigen-memory-maintenance` last ran with HTTP 429 rate limit**
   - Cron health is otherwise OK, but this job last errored.
   - Treat as blocker for full studio automation reliability until stable run observed.
   - Fix: increase interval or reconnect with backoff/scheduling change.

6. **Optional integrations still gated by system deps**
   - **Optional integrations gated by missing system dependencies**
     - `browser-cdp`, `computer_use`, `feishu_doc`, `feishu_drive`, `hermes-yuanbao`, `homeassistant`, `spotify`.
     - Each is blocked by an uninstalled system dependency, not configured in this machine.
     - Not mandatory for the current studio setup.
     - Fix: install each missing system dependency only if that integration is required.

7. **Profiles alias bookkeeping has orphans**
   - The active profile path points to `gta6-hub` (`APPDATA\Local\hermes\profiles\gta6-hub`).
   - Orphan aliases exist: `adhd`, `arc-raiders`, `byjtt`, `helix-game`, `pc-optimizer`, `promptforge`, `rork-parity`, `xcelerate`.
   - Fix: delete stale `.bat` aliases or recreate those profiles if still needed.

8. **No `GITHUB_TOKEN` configured in profile `.env`**
   - Doctor reports missing GitHub token, capping GitHub API rate limits to 60 req/hr.
   - Fix: add `GITHUB_TOKEN` to `C:\Users\jorda\AppData\Local\hermes\profiles\gta6-hub\.env`.

9. **Cron memory maintenance needs resilience**
   - Last run failed with HTTP 429, indicating rate-limit exhaustion on the memory-maintenance delivery.
   - Fix-only is backoff / stagger along with token/usage tuning.

10. **Reconfirm model routing after fix**
    - Once #1 is fixed, explicitly validate that requests under `gta6-hub` actually route to `gpt-5.6-luna` through `merge-gateway`.
    - Fix: run a short probe and confirm model/metadata in response.

---

## PRIORITIZED FIX ORDER
1. Fix model slug warning in `config.yaml` -> provider/slug alignment or vendor prefix removal.
2. Add `C:\Users\jorda\.bun\bin` to PATH for this shell.
3. Confirm `gbrain doctor` in a new shell, then register gBrain MCP under this profile and expose in Hermes tools.
4. Do a Telegram delivery test and confirm runtime receipt.
5. Stabilize `eigen-memory-maintenance` by addressing HTTP 429 via backoff/interval change.
6. Optionally clean orphan profile aliases if desired.
