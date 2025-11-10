import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

console.log('🚀 SgravoQuest starting...')
console.log('📦 Root element:', document.getElementById('root'))

const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('❌ Root element not found!')
  document.body.innerHTML = '<h1 style="color:red">Error: Root element not found</h1>'
} else {
  console.log('✅ Root element found, mounting React...')
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  console.log('✅ React mounted!')
}
