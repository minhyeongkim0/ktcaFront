import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8000";

export async function GET() {
  const url = `${API_URL}/devices`;
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 10 },
    });
    const text = await res.text();
    if (!res.ok) {
      console.error(`[FDC API] GET ${url} failed: ${res.status}`, text);
      return NextResponse.json(
        { error: `Upstream API error: ${res.status}`, body: text },
        { status: res.status }
      );
    }
    const data = JSON.parse(text || "{}");
    return NextResponse.json(data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[FDC API] GET ${url} failed:`, msg);
    return NextResponse.json(
      { error: "Upstream fetch failed", message: msg, url },
      { status: 502 }
    );
  }
}
