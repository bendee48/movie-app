import { useState } from 'react'
import './App.css'
import Result from './Result'
import FilmSelector from './FilmSelector';

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

  function handleSubmit(e) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData);
    handleGetFilmWithOptions(data)
  }

  async function handleGetFilmWithOptions(searchOptions={}) {
    setIsLoading(true);
    const params = new URLSearchParams(searchOptions);

    try {
      const response = await fetch(`http://localhost:3001/api/film/?${encodeURI(params.toString())}`);
      if (!response.ok) {
        throw new Error(`Uh oh... Status: ${response.status}`);
      }
      const data = await response.json();
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
      <FilmSelector submitHandler={handleSubmit}/>
      {isLoading && <p>Thinking...</p>}
      {error && <p>{error}</p>}
      {!isLoading && !error && <Result content={reccomendation}/>}
    </>
  )
}

export default App;
