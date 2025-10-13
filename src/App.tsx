import GameCanvas from './components/GameCanvas'
import './App.css'

function App() {
  return (
    <div className="app">
      <header>
        <h1>🎮 SgravoQuest</h1>
        <p>2D RPG Framework - Rendering Engine Demo</p>
      </header>

      <main>
        <GameCanvas width={800} height={600} />
      </main>

      <footer>
        <p>Assets from <a href="https://kenney.nl" target="_blank">Kenney.nl</a> (CC0) • Served via jsDelivr CDN</p>
      </footer>
    </div>
  )
}

export default App
