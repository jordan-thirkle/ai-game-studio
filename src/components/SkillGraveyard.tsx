'use client';

import { useState } from 'react';

export function SkillGraveyard() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#a0a090]">
        Retired skills with full evidence — what was tried, what happened, why it failed.
        A visible graveyard of failures is more credible than a highlight reel.
      </p>

      {/* Graveyard entries go here once real skills have been retired.
          No placeholder examples. No mock data. No fabricated entries.
          The graveyard is empty until a skill actually fails a trial. */}

      <div className="p-8 bg-[#0a0f0a]/30 rounded-xl border border-[#2a3a22] text-center">
        <p className="text-sm text-[#606060]">
          No retired skills yet. The graveyard fills as we learn what doesn&apos;t work.
        </p>
        <p className="text-xs text-[#404040] mt-2">
          Every entry will include: what was tried, trial result, score delta, why it failed, what it would work for.
        </p>
      </div>
    </div>
  );
}
