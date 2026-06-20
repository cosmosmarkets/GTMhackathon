import { NextResponse } from "next/server";
import { buildChampionTable } from "@/lib/champion/table";

// GET /api/champions — the ranked champion table (seeds + live captures).
// Role B's table view (app/champions) renders this; exposed as JSON too.
export const dynamic = "force-dynamic";
export const maxDuration = 60; // scores leads via Opus; needs room beyond the default timeout

export async function GET() {
  const table = await buildChampionTable();
  return NextResponse.json(table);
}
