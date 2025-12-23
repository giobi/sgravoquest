import { useState } from 'react'
import GameCanvas from './components/GameCanvas'
import DialogBox from './components/DialogBox'
// import { AIQuestGenerator } from './engine/AIQuestGenerator' // TODO: Re-enable when backend proxy is ready
import type { Quest } from './engine/AIQuestGenerator'
import './App.css'

function App() {
  const [showDialog, setShowDialog] = useState(false)
  const [dialogText, setDialogText] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null)

  // Pool di prompt diversi per varietà
  const questPrompts = [
    'Un ladro deve infiltrarsi in una cripta antica per rubare un artefatto maledetto',
    'Un mago esplora una torre abbandonata piena di esperimenti andati male',
    'Un cavaliere cerca il santo graal nelle profondità di un tempio sommerso',
    'Un assassino deve eliminare il capo di una gilda di necromanti',
    'Un esploratore scopre rovine di una civiltà perduta nella giungla',
    'Un cacciatore di mostri affronta un vampiro nel suo castello',
    'Un alchimista cerca ingredienti rari in una miniera infestata da goblin',
    'Un paladino deve purificare un santuario corrotto dal male',
    'Un bardo raccoglie storie in una taverna maledetta',
    'Un druido protegge una foresta sacra da cultisti oscuri'
  ]

  const generateQuest = async () => {
    setIsGenerating(true)

    try {
      // Pick random prompt for variety
      const randomPrompt = questPrompts[Math.floor(Math.random() * questPrompts.length)]

      const response = await fetch("/api/generate-quest", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: randomPrompt
        })
      })

      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`)
      }

      const quest = await response.json()

      // Salva la quest nello state
      setCurrentQuest(quest)

      setDialogText([
        `⚔️ ${quest.title}`,
        quest.description,
        `Obiettivi: ${quest.objectives.join(', ')}`,
        'Premi SPAZIO per caricare la mappa!'
      ])
      setShowDialog(true)

      console.log('✅ Quest caricata:', quest)
    } catch (error) {
      console.error('Errore generazione quest:', error)
      setDialogText([
        '❌ Errore nella generazione',
        'Riprova tra poco...'
      ])
      setShowDialog(true)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="app">
      <header>
        <h1>🎮 SgravoQuest</h1>
        <p>AI-Powered Narrative RPG Generator</p>
      </header>

      <main>
        <GameCanvas width={800} height={600} quest={currentQuest} />

        <button
          className="generate-button"
          onClick={generateQuest}
          disabled={isGenerating}
        >
          {isGenerating ? '⏳ Generando...' : '✨ Genera Avventura AI'}
        </button>
      </main>

      {showDialog && (
        <DialogBox
          text={dialogText}
          onComplete={() => setShowDialog(false)}
        />
      )}

      <footer>
        <p>Powered by Claude 3 Haiku via OpenRouter • Assets from <a href="https://kenney.nl" target="_blank">Kenney.nl</a> (CC0)</p>
        <p style={{ fontSize: "0.75rem", opacity: 0.6, marginTop: "0.25rem" }}>v0.5.0-alpha</p>
      </footer>
    </div>
  )
}

export default App
