import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      return NextResponse.json({ error: 'Gemini API key not found.' }, { status: 500 });
    }

    // THIS IS THE FIX: A more structured and explicit prompt for the Gemini API
    const prompt = `Generate 20 unique programming problems about "${topic}".
    For each problem, return a JSON object with the following exact structure:
    {
      "slug": "a-unique-url-slug",
      "title": "Problem Title",
      "description": "A detailed description of the problem.",
      "difficulty": "Easy",
      "examples": [
        {
          "input": "Example input as a string",
          "output": "Example output as a string",
          "explanation": "Optional explanation"
        }
      ],
      "constraints": [
        "Constraint 1 as a string",
        "Constraint 2 as a string"
      ],
      "starterCode": "function solve() {\\n  // Your starter code here\\n}"
    }
    Return the entire response as a single, valid JSON array of these objects.`;
    
    const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    
    if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
      const text = result.candidates[0].content.parts[0].text;
      const cleanedText = text.replace(/```json\n|```/g, '').trim();
      const problems = JSON.parse(cleanedText);
      return NextResponse.json({ problems });
    } else {
       return NextResponse.json({ error: 'Failed to generate problems.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error generating problems:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
