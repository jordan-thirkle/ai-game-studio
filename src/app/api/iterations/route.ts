import { NextResponse } from "next/server";
import { games } from "@/data/games";

const MAX_BRIEF_LENGTH = 2_000;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { game?: unknown; brief?: unknown } | null;
  const game = typeof body?.game === "string" ? body.game.trim() : "";
  const brief = typeof body?.brief === "string" ? body.brief.trim() : "";

  if (!games.some((entry) => entry.slug === game)) {
    return NextResponse.json({ error: "Choose a valid game." }, { status: 400 });
  }
  if (brief.length < 12 || brief.length > MAX_BRIEF_LENGTH) {
    return NextResponse.json({ error: `The brief must be between 12 and ${MAX_BRIEF_LENGTH} characters.` }, { status: 400 });
  }

  const id = `iteration-${Date.now().toString(36)}`;
  return NextResponse.json({
    id,
    status: "queued",
    game,
    brief,
    message: "Brief queued for isolated preview work. No production files were changed.",
  }, { status: 202 });
}
