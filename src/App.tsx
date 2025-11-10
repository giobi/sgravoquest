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

  const generateQuest = async () => {
    setIsGenerating(true)

    try {
      // Call backend API proxy (sicuro!)
      

      const response = await fetch("/api/generate-quest", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: 'Un giovane guerriero deve salvare il villaggio da un drago che terrorizza la popolazione'
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
        <p>Powered by Groq AI (llama-3.3-70b) • Assets from <a href="https://kenney.nl" target="_blank">Kenney.nl</a> (CC0)</p>
      </footer>
    </div>
  )
}

export default App
