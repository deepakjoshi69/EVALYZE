import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { skill, difficulty, testType } = await req.json();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!skill || !difficulty || !testType) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  // Craft a prompt for Gemini
  const prompt = `
    Generate a unique ${difficulty} level, ${testType}-style programming question for the topic ${skill}.
    Include input/output examples and a detailed statement in JSON format: { title, description, examples: [{input,output,explanation}], constraints }.
  `;

  // Gemini API call (replace with your SDK or fetch implementation)
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=' + apiKey, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 1,
        maxOutputTokens: 1024
      }
    }),
  });

  const data = await response.json();
  // You may need to parse the data depending on Gemini's actual response structure
  const questionContent = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Attempt to parse response as JSON, fallback to raw text if not possible
  try {
    const parsed = JSON.parse(questionContent);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ raw: questionContent });
  }
}
