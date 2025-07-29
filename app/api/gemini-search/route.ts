import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json({ error: "Missing query parameter." }, { status: 400 });
    }

    // Call Gemini Search API endpoint
    const url = `https://www.googleapis.com/customsearch/v1?key=${GEMINI_API_KEY}&cx=YOUR_SEARCH_ENGINE_ID&q=${encodeURIComponent(
      query
    )}`;

    // Replace YOUR_SEARCH_ENGINE_ID with the actual Google Custom Search Engine ID you created.
    // You must set this up in your Google Cloud Console for the Gemini API or use the correct Gemini search endpoint.

    const res = await fetch(url);
    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ error: "Gemini API error: " + errorText }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Gemini API Proxy error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
