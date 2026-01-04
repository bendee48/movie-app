import { useState } from 'react'
import './App.css'
import Result from './Result'

function App() {
  const [reccomendation, setReccomendation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleGetFilm() {
    setIsLoading(true);

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
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <h1>Movie App</h1>
      <button onClick={handleGetFilm} disabled={isLoading}>I feel lucky punk</button>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!isLoading && !error && <Result content={reccomendation}/>}
    </>
  )
}

export default App;
