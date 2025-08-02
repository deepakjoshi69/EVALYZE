import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { skill, level, testType } = await request.json();
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      return NextResponse.json({ error: 'Gemini API key not found.' }, { status: 500 });
    }

    // THIS IS THE FIX: A much more detailed prompt for better, unique, and randomized questions.
    const prompt = `Generate a ${testType} skill test with 5 completely unique and creative questions for the topic "${skill}" at a "${level}" difficulty level. Ensure the questions are distinct from each other and cover different aspects of the topic.

For each question, return a JSON object with the following exact structure:
{
  "id": "A unique number for the question",
  "question": "The question text.",
  "type": "${testType}",
  "options": ["Option A", "Option B", "Option C", "Option D"], // For 'theoretical' type, ensure the options are randomized and the correct answer is not always in the same position.
  "correctAnswer": "The correct answer.",
  "explanation": "A brief explanation of the correct answer."
}
Return the entire response as a single, valid JSON array of these 5 objects.`;
    
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
      const questions = JSON.parse(cleanedText);
      return NextResponse.json({ questions });
    } else {
       return NextResponse.json({ error: 'Failed to generate test questions.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error generating test:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
