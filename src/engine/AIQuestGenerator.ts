/**
 * AIQuestGenerator
 *
 * Genera avventure RPG da prompt testuali usando OpenRouter AI
 */

export interface Quest {
  title: string
  description: string
  maps: QuestMap[]
  npcs: QuestNPC[]
  enemies: QuestEnemy[]
  dialogs: Dialog[]
  objectives: string[]
}

export interface QuestMap {
  id: string
  name: string
  width: number
  height: number
  tiles: number[][]
  npcs: { npcId: string; x: number; y: number }[]
  enemies: { enemyId: string; x: number; y: number }[]
  startPosition?: { x: number; y: number }
}

export interface QuestNPC {
  id: string
  name: string
  sprite: string
  dialogId: string
}

export interface QuestEnemy {
  id: string
  name: string
  sprite: string
  hp: number
  atk: number
  def: number
  exp: number
  gold: number
}

export interface Dialog {
  id: string
  text: string[]
  choices?: DialogChoice[]
}

export interface DialogChoice {
  text: string
  nextDialogId?: string
  action?: 'battle' | 'give_item' | 'end'
}

export class AIQuestGenerator {
  private apiKey: string
  private apiUrl = 'https://api.groq.com/openai/v1/chat/completions'

  // Groq free models (MOLTO più veloce!)
  private model = 'llama-3.3-70b-versatile' // o 'gemma2-9b-it'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * Genera una quest da un prompt testuale
   */
  async generateQuest(userPrompt: string): Promise<Quest> {
    const systemPrompt = `Sei un game designer esperto di RPG.
Genera un'avventura RPG in formato JSON da questo prompt dell'utente.

Regole:
- Mappe max 20x20 tiles
- Usa tile IDs: 1=floor, 14=wall, 25=decoration
- NPCs e nemici con posizioni
- Dialoghi coinvolgenti
- 3-5 obiettivi chiari

Ritorna SOLO JSON valido, nessun testo extra.

Formato JSON:
{
  "title": "Titolo Avventura",
  "description": "Descrizione breve",
  "maps": [{
    "id": "village",
    "name": "Villaggio",
    "width": 15,
    "height": 15,
    "tiles": [[1,1,14,...], ...],
    "npcs": [{"npcId": "elder", "x": 7, "y": 7}],
    "enemies": [],
    "startPosition": {"x": 5, "y": 5}
  }],
  "npcs": [{
    "id": "elder",
    "name": "Anziano del Villaggio",
    "sprite": "npc",
    "dialogId": "elder_intro"
  }],
  "enemies": [{
    "id": "dragon",
    "name": "Drago Rosso",
    "sprite": "monster",
    "hp": 100,
    "atk": 25,
    "def": 10,
    "exp": 500,
    "gold": 1000
  }],
  "dialogs": [{
    "id": "elder_intro",
    "text": ["Benvenuto eroe!", "Il regno è in pericolo!"],
    "choices": [
      {"text": "Aiuterò il regno!", "nextDialogId": "elder_quest"},
      {"text": "Non posso aiutare", "action": "end"}
    ]
  }],
  "objectives": [
    "Parla con l'anziano",
    "Sconfiggi il drago",
    "Salva il regno"
  ]
}`

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 4000
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    // Parse JSON dalla risposta (rimuovi eventuali markdown)
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('AI non ha ritornato JSON valido')
    }

    const quest: Quest = JSON.parse(jsonMatch[0])

    console.log('🎭 Quest generata:', quest.title)
    console.log('📜 Obiettivi:', quest.objectives.length)
    console.log('🗺️  Mappe:', quest.maps.length)

    return quest
  }

  /**
   * Genera una mappa semplice procedurale (fallback se AI fallisce)
   */
  generateSimpleMap(width: number, height: number): number[][] {
    const map: number[][] = []

    for (let y = 0; y < height; y++) {
      const row: number[] = []
      for (let x = 0; x < width; x++) {
        // Bordi = muri
        if (x === 0 || y === 0 || x === width - 1 || y === height - 1) {
          row.push(14)
        }
        // Decorazioni sparse
        else if (Math.random() < 0.1) {
          row.push(25)
        }
        // Floor
        else {
          row.push(1)
        }
      }
      map.push(row)
    }

    return map
  }
}
