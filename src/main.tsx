import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx' // It's in the same folder now
import './index.css' // Ensure you move index.css to src/ as well or update path

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)