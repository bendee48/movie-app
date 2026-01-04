import { useState } from 'react'
import './App.css'

function App() {
  const [reccomendation, setReccomendation] = useState("");

  async function handleGetFilm() {
    try {
      const response = await fetch("http://localhost:3001/api/film/lucky");
      if (!response.ok) {
        throw new Error(`Uh oh... Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(reccomendation, data)
      setReccomendation(data.result);
    } catch(e) {
      console.log(e.message)
    }
  }

  return (
    <>
      <h1>Movie App</h1>
      <button onClick={handleGetFilm}>I feel lucky punk</button>
      <p>{reccomendation}</p>
    </>
  )
}

export default App
