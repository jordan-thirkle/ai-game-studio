"use client";

import { FormEvent, useState } from "react";
import { games } from "@/data/games";

export function IterationForm() {
  const [game, setGame] = useState(games[0]?.slug ?? "");
  const [brief, setBrief] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setStatus(null); setError(null);
    try {
      const response = await fetch("/api/iterations", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ game, brief }) });
      const data = await response.json() as { message?: string; error?: string; id?: string };
      if (!response.ok) throw new Error(data.error ?? "The brief could not be queued.");
      setStatus(`${data.message} Reference: ${data.id}`); setBrief("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The brief could not be queued.");
    } finally { setBusy(false); }
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={submit} aria-describedby="iteration-help iteration-result">
      <div><label className="form-label" htmlFor="game">Game</label><select id="game" name="game" className="form-input" value={game} onChange={(event) => setGame(event.target.value)}>{games.map((entry) => <option key={entry.slug} value={entry.slug}>{entry.title}</option>)}</select></div>
      <div><label className="form-label" htmlFor="brief">Iteration brief</label><textarea id="brief" name="brief" rows={5} className="form-input" value={brief} onChange={(event) => setBrief(event.target.value)} placeholder="Describe one measurable change to make next." required minLength={12} maxLength={2000} /><p id="iteration-help" className="mt-2 text-sm text-[var(--color-ink-soft)]">Keep the brief narrow enough to verify with a build, test, or runtime metric.</p></div>
      <button type="submit" className="btn-primary" disabled={busy}>{busy ? "Queueing…" : "Create preview brief"}</button>
      <div id="iteration-result" aria-live="polite" role={error ? "alert" : undefined}>{error ? <p className="form-error">{error}</p> : status ? <p className="text-sm text-[var(--color-moss-dark)]">{status}</p> : null}</div>
    </form>
  );
}
