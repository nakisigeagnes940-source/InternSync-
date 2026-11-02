import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, department } = req.body;

  try {
    // 2. Call OpenRouter securely on the server using process.env
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://internsync.vercel.app',
        'X-Title': 'InternSync',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert assistant helping hospitality and vocational trainees write professional, structured daily logbook entries for their department (${department}).`
          },
          {
            role: 'user',
            content: `Write a professional logbook entry for this task: "${prompt}"`
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    const resultText = data.choices[0]?.message?.content || '';

    // 3. Return only the result back to your frontend
    return res.status(200).json({ text: resultText });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
