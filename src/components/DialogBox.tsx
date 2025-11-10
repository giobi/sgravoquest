import { useState, useEffect } from 'react'
import './DialogBox.css'

interface DialogBoxProps {
  text: string[]
  choices?: { text: string; onSelect: () => void }[]
  onComplete?: () => void
}

function DialogBox({ text, choices, onComplete }: DialogBoxProps) {
  const [currentLine, setCurrentLine] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    if (currentLine >= text.length) {
      setIsTyping(false)
      return
    }

    const fullText = text[currentLine]
    let charIndex = 0

    setDisplayedText('')
    setIsTyping(true)

    const interval = setInterval(() => {
      if (charIndex < fullText.length) {
        setDisplayedText(fullText.substring(0, charIndex + 1))
        charIndex++
      } else {
        setIsTyping(false)
        clearInterval(interval)
      }
    }, 30) // 30ms per carattere = effetto typewriter

    return () => clearInterval(interval)
  }, [currentLine, text])

  const handleNext = () => {
    if (isTyping) {
      // Se sta ancora scrivendo, completa subito
      setDisplayedText(text[currentLine])
      setIsTyping(false)
    } else if (currentLine < text.length - 1) {
      // Prossima linea
      setCurrentLine(currentLine + 1)
    } else if (!choices && onComplete) {
      // Fine dialogo
      onComplete()
    }
  }

  // Aggiungi supporto tastiera (SPAZIO o ENTER)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentLine, isTyping, text, choices, onComplete])

  const showChoices = !isTyping && currentLine === text.length - 1 && choices

  return (
    <div className="dialog-box" onClick={handleNext}>
      <div className="dialog-text">{displayedText}</div>

      {!isTyping && !showChoices && currentLine < text.length - 1 && (
        <div className="dialog-prompt">▼ Clicca o premi SPAZIO per continuare</div>
      )}

      {!isTyping && !showChoices && currentLine === text.length - 1 && !choices && (
        <button className="dialog-close-button" onClick={handleNext}>
          ✕ Chiudi (SPAZIO)
        </button>
      )}

      {showChoices && (
        <div className="dialog-choices">
          {choices.map((choice, index) => (
            <button
              key={index}
              className="dialog-choice-button"
              onClick={(e) => {
                e.stopPropagation()
                choice.onSelect()
              }}
            >
              {choice.text}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default DialogBox
