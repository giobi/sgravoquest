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
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!geminiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const systemPrompt = `Generate RPG quest: "${prompt}"

Return ONLY JSON:
{
  "title": "Title in Italian",
  "description": "Description in Italian (1 sentence)",
  "objectives": ["obj 1", "obj 2"],
  "map": {
    "width": 10,
    "height": 7,
    "tiles": [[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0]]
  },
  "entities": [
    {"type": "player", "x": 1, "y": 3},
    {"type": "enemy", "x": 8, "y": 4, "name": "Nome"}
  ]
}

Tiles: 0=grass, 1=water, 2=mountain, 3=forest, 4=path
Map: 10 columns × 7 rows EXACT
KEEP IT SHORT`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: systemPrompt }]
          }],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 3000,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const questText = data.candidates[0].content.parts[0].text;

    // Parse JSON from response
    let quest: Quest;
    try {
      quest = JSON.parse(questText);
    } catch (parseError) {
      const jsonMatch = questText.match(/```json\n?([\s\S]*?)\n?```/) ||
                       questText.match(/```\n?([\s\S]*?)\n?```/) ||
                       questText.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        let jsonText = jsonMatch[1] || jsonMatch[0];
        jsonText = jsonText.trim();
        quest = JSON.parse(jsonText);
      } else {
        console.error('Failed to parse quest JSON:', questText.substring(0, 500));
        throw new Error('Invalid JSON response from AI');
      }
    }

    // Validate required fields
    if (!quest.title || !quest.description || !quest.objectives || !quest.map || !quest.entities) {
      throw new Error('Invalid quest structure - missing required fields');
    }

    // Validate map dimensions
    if (!Array.isArray(quest.map.tiles) || quest.map.tiles.length === 0) {
      throw new Error('Invalid map tiles');
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
