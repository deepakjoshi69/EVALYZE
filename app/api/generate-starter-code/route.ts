import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { description, language } = await request.json();
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      return NextResponse.json({ error: 'Gemini API key not found.' }, { status: 500 });
    }

    const prompt = `Based on the following problem description, generate only the boilerplate starter code for the ${language} language. Do not add any explanation or surrounding text, just the raw code.

Problem Description:
"${description}"`;
    
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
      const starterCode = result.candidates[0].content.parts[0].text;
      // Clean the response to remove markdown formatting
      const cleanedCode = starterCode.replace(/```[a-z]*\n|```/g, '').trim();
      return NextResponse.json({ starterCode: cleanedCode });
    } else {
       return NextResponse.json({ error: 'Failed to generate starter code.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error generating starter code:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
