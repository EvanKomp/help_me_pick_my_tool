import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  if (!supabase) {
    return NextResponse.json({});
  }

  const { data, error } = await supabase
    .from("tool_votes")
    .select("node_id, tool_section, tool_index, vote");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Aggregate: { "nodeId:section:index": { up: N, down: N } }
  const counts = {};
  for (const row of data) {
    const key = `${row.node_id}:${row.tool_section}:${row.tool_index}`;
    if (!counts[key]) counts[key] = { up: 0, down: 0 };
    if (row.vote > 0) counts[key].up++;
    else counts[key].down++;
  }

  return NextResponse.json(counts);
}

export async function POST(request) {
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const body = await request.json();
  const { node_id, tool_section, tool_index, tool_name, vote, session_id } = body;

  if (!node_id || !tool_section || tool_index == null || !vote || !session_id) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Upsert: update if this session already voted on this tool
  const { error } = await supabase
    .from("tool_votes")
    .upsert(
      { node_id, tool_section, tool_index, tool_name, vote, session_id },
      { onConflict: "node_id,tool_section,tool_index,session_id" }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
