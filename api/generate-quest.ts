import type { VercelRequest, VercelResponse } from '@vercel/node';

interface QuestRequest {
  prompt: string;
}

interface Quest {
  title: string;
  description: string;
  objectives: string[];
  map: {
    width: number;
    height: number;
    tiles: number[][];
  };
  entities: Array<{
    type: string;
    x: number;
    y: number;
    name?: string;
  }>;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body as QuestRequest;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const groqApiKey = process.env.GROQ_API_KEY;
    
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are a RPG quest generator. Generate a quest based on user prompt.
            
Return ONLY valid JSON in this exact format:
{
  "title": "Quest title",
  "description": "Quest description (2-3 sentences)",
  "objectives": ["objective 1", "objective 2", "objective 3"],
  "map": {
    "width": 20,
    "height": 15,
    "tiles": [[0,0,0...], [0,1,0...], ...]
  },
  "entities": [
    {"type": "player", "x": 5, "y": 5},
    {"type": "enemy", "x": 10, "y": 8, "name": "Dragon"},
    {"type": "npc", "x": 3, "y": 3, "name": "Merchant"}
  ]
}

Tile types: 0=grass, 1=water, 2=mountain, 3=forest, 4=path
Entity types: player, enemy, npc, item, treasure`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const questText = data.choices[0].message.content;

    // Parse JSON from response
    let quest: Quest;
    try {
      // Extract JSON if wrapped in markdown
      const jsonMatch = questText.match(/```json\n?([\s\S]*?)\n?```/) || questText.match(/```\n?([\s\S]*?)\n?```/);
      const jsonText = jsonMatch ? jsonMatch[1] : questText;
      quest = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse quest JSON:', questText);
      throw new Error('Invalid JSON response from AI');
    }

    return res.status(200).json(quest);

  } catch (error) {
    console.error('Quest generation error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate quest',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
