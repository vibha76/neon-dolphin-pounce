import { IncomingMessage, ServerResponse } from 'http';

const OPENAI_API_KEY = "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";
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

interface VercelRequest extends IncomingMessage {
  method: string;
  body: any;
}

interface VercelResponse extends ServerResponse<IncomingMessage> {
  status: (code: number) => VercelResponse;
  json: (data: any) => VercelResponse;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add the status and json methods to the response object
  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };

  res.json = (data: any) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
    return res;
  };

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { message, context } = req.body;

    if (!message || !context) {
      res.status(400).json({ error: 'Message and context are required' });
      return;
    }

    const systemPrompt = `
      You are FinAssist AI, a financial assistant helping users manage their personal finances in India.
      You have access to the user's financial data including:
      - Current balance
      - Income and expense history
      - Spending categories
      - Transaction history
      - Savings rate

      Provide personalized financial advice based on their actual data.
      Be concise, helpful, and avoid generic advice.
      When appropriate, suggest specific actions based on their spending patterns.
      If asked about features not available, explain what the app can do.
      Always respond in the same language the user uses.
      Format amounts in Indian Rupees (₹).
      Never provide investment advice that could be risky.
    `;

    const messages = [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: `User's financial context:\n${context}\n\nUser's message: ${message}`
      }
    ];

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();

    // Check if response has content
    if (!data.choices || data.choices.length === 0 || !data.choices[0].message) {
      throw new Error("No content in response from OpenAI API");
    }

    res.status(200).json({ response: data.choices[0].message.content.trim() });
  } catch (error: any) {
    console.error('AI Service Error:', error);
    res.status(500).json({ error: `AI Service error: ${error.message}` });
  }
}