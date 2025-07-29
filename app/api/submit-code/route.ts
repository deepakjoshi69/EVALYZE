import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { code, language_id } = await request.json();
    const judge0ApiKey = process.env.JUDGE0_API_KEY;

    // --- DEBUGGING STEP ---
    // This will print the key to your VS Code terminal when the API is called.
    console.log("Attempting to use Judge0 API Key:", judge0ApiKey); 
    // ----------------------

    if (!judge0ApiKey) {
      console.error("Judge0 API key was not found in .env.local");
      return NextResponse.json({ error: 'Judge0 API key not found on the server.' }, { status: 500 });
    }

    const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': judge0ApiKey,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      },
      body: JSON.stringify({
        source_code: code,
        language_id: language_id,
      }),
    });

    const result = await response.json();
    
    // --- DEBUGGING STEP ---
    console.log("Received response from Judge0:", result);
    // ----------------------

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error submitting code:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
