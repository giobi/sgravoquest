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
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    
    if (!openrouterKey) {
      throw new Error('OPENROUTER_API_KEY not configured');
    }

    // Call OpenRouter API with FREE Gemini Flash 1.5
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://sgravoquest.vercel.app',
        'X-Title': 'SgravoQuest RPG Generator'
      },
      body: JSON.stringify({
        model: 'google/gemini-flash-1.5',  // FREE MODEL
        messages: [
          {
            role: 'user',
            content: `You are a RPG quest generator for a pixel-art 2D game. Generate a quest based on this prompt: "${prompt}"
            
Return ONLY valid JSON (NO markdown, NO code blocks) in this exact format:
{
  "title": "Quest title in Italian",
  "description": "Quest description in Italian (2-3 sentences)",
  "objectives": ["objective 1 in Italian", "objective 2", "objective 3"],
  "map": {
    "width": 20,
    "height": 15,
    "tiles": [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], ...repeat for 15 rows]
  },
  "entities": [
    {"type": "player", "x": 5, "y": 5},
    {"type": "enemy", "x": 10, "y": 8, "name": "Drago"},
    {"type": "npc", "x": 3, "y": 3, "name": "Mercante"}
  ]
}

Tile types: 0=grass, 1=water, 2=mountain, 3=forest, 4=path
Entity types: player, enemy, npc, item, treasure
Map size: 20 columns x 15 rows (exact)
Create varied terrain and place entities logically.`
          }
        ],
        temperature: 0.8,
        max_tokens: 3000
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter error:', errorData);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const questText = data.choices[0].message.content;

    // Parse JSON from response
    let quest: Quest;
    try {
      // Try direct parse first
      quest = JSON.parse(questText);
    } catch (parseError) {
      // Try to extract from markdown if wrapped
      const jsonMatch = questText.match(/```json\n?([\s\S]*?)\n?```/) || 
                       questText.match(/```\n?([\s\S]*?)\n?```/) ||
                       questText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const jsonText = jsonMatch[1] || jsonMatch[0];
        quest = JSON.parse(jsonText);
      } else {
        console.error('Failed to parse quest JSON:', questText);
        throw new Error('Invalid JSON response from AI');
      }
    }

    // Validate required fields
    if (!quest.title || !quest.description || !quest.objectives || !quest.map || !quest.entities) {
      throw new Error('Invalid quest structure');
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
