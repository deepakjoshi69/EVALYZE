import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      return NextResponse.json({ error: 'Gemini API key not found.' }, { status: 500 });
    }

    // This prompt is specifically designed to get search suggestions
    const prompt = `Based on the user's technical skill search query "${query}", generate up to 5 relevant and more specific topic suggestions for a skill test. For example, if the user types "React", suggest "React Hooks", "React State Management". Return this as a JSON array of simple strings.`;
    
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
      const suggestions = JSON.parse(cleanedText);
      return NextResponse.json({ suggestions });
    } else {
       return NextResponse.json({ suggestions: [] });
    }

  } catch (error) {
    console.error('Error generating suggestions:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
