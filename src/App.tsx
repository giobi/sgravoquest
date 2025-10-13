import { useState } from 'react'
import GameCanvas from './components/GameCanvas'
import DialogBox from './components/DialogBox'
import { AIQuestGenerator } from './engine/AIQuestGenerator'
import './App.css'

function App() {
  const [showDialog, setShowDialog] = useState(false)
  const [dialogText, setDialogText] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateQuest = async () => {
    setIsGenerating(true)
    // Groq API key (MOLTO più veloce di OpenRouter!)
    const apiKey = import.meta.env.VITE_GROQ_API_KEY

    const generator = new AIQuestGenerator(apiKey)

    try {
      const quest = await generator.generateQuest(
        'Un giovane guerriero deve salvare il villaggio da un drago che terrorizza la popolazione'
      )

      setDialogText([
        `⚔️ ${quest.title}`,
        quest.description,
        `Obiettivi: ${quest.objectives.join(', ')}`,
        'Premi SPAZIO per iniziare l\'avventura!'
      ])
      setShowDialog(true)
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
        <GameCanvas width={800} height={600} />

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
