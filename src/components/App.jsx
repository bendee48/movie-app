import { useState } from 'react'
import './App.css'
import Result from './Result'
import FilmSelector from './FilmSelector';

function App() {
  const [filmData, setFilmData] = useState({title: "", year: "", director: "", summary: ""});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleGetFilm() {
    setIsLoading(true);
    const prevFilms = JSON.parse(localStorage.getItem("previousFilms")) || [];

    try {
      const response = await fetch("http://localhost:3001/api/film/lucky" , {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ previousFilms: prevFilms }),
      });
      if (!response.ok) {
        throw new Error(`Uh oh... Status: ${response.status}`);
      }
      const data = await response.json();
      const parsedData = JSON.parse(data.result);
      // save the film title into localStorage
      prevFilms.push(parsedData.title)
      localStorage.setItem("previousFilms", JSON.stringify(prevFilms))
      setFilmData(
        { 
          title: parsedData.title, 
          year: parsedData.year, 
          director: parsedData.director, 
          summary: parsedData.summary
        });
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
    const prevFilms = JSON.parse(localStorage.getItem("previousFilms")) || [];

    try {
      const response = await fetch(`http://localhost:3001/api/film/?${encodeURI(params.toString())}`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ previousFilms: prevFilms }),
      });
      if (!response.ok) {
        throw new Error(`Uh oh... Status: ${response.status}`);
      }
      const data = await response.json();
      const parsedData = JSON.parse(data.result);
      // save the film title into localStorage
      prevFilms.push(parsedData.title)
      localStorage.setItem("previousFilms", JSON.stringify(prevFilms))
      setFilmData(
        { 
          title: parsedData.title, 
          year: parsedData.year, 
          director: parsedData.director, 
          summary: parsedData.summary
        });
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
      {!isLoading && !error && <Result {...filmData}/>}
    </>
  )
}

export default App;
