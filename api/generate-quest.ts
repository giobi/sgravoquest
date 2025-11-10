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

    const systemPrompt = `Generate RPG quest: "${prompt}"

Return JSON (Italian):
{
  "title": "Quest title",
  "description": "Description (1 sentence)",
  "objectives": ["objective 1", "objective 2"],
  "map": {
    "width": 50,
    "height": 37,
    "tiles": [[0,0,0,...], ...37 rows (50 cols each)]
  },
  "entities": [
    {"type": "player", "x": 1, "y": 3},
    {"type": "enemy", "x": 8, "y": 4, "name": "Name"}
  ]
}
Tiles: 0=grass 1=water 2=mountain 3=forest 4=path`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://sgravoquest.vercel.app',
        'X-Title': 'SgravoQuest'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [{ role: 'user', content: systemPrompt }],
        temperature: 0.6,
        max_tokens: 2500
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter error:', errorData);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      console.error('No choices in response:', JSON.stringify(data));
      throw new Error('API returned no choices');
    }

    const questText = data.choices[0].message.content;

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
        quest = JSON.parse(jsonText);
      } else {
        console.error('Failed to parse:', questText.substring(0, 500));
        throw new Error('Invalid JSON from AI');
      }
    }

    if (!quest.title || !quest.map || !quest.entities) {
      throw new Error('Invalid quest structure');
    }

    // Transform map to maps array for frontend
    const { map, ...questData } = quest;
    return res.status(200).json({ ...questData, maps: [map] });

  } catch (error) {
    console.error('Quest generation error:', error);
    return res.status(500).json({
      error: 'Failed to generate quest',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
