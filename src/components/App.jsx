import { useState, useRef, useEffect } from 'react'
import styles from './App.module.css'
import Result from './Result'
import FilmSelector from './FilmSelector'

/**
 * Main application component for the movie app.
 * It handles random recommendations, filtered suggestions, loading/error states,
 * and the local recommendation history used to avoid repetitive results.
 */
function App() {
  const [filmData, setFilmData] = useState({
    title: "",
    year: "",
    director: "",
    actors: "",
    summary: "",
    notFound: true,
    reason: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const resultsRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || "";

  // Scroll to the results section when a new film is loaded, or when an error occurs.
  useEffect(() => {
    if (isLoading || error || filmData.title) {
      resultsRef.current.scrollIntoView({behavior: "smooth"});
    }
  },[filmData, isLoading, error]);

  /**
   * Requests a random film recommendation from the backend and stores the result
   * in localStorage to avoid repeating films too often.
   * @returns {Promise<void>}
   */
  async function handleGetFilm() {
    setIsLoading(true);
    setError(null);
    
    try {
      const prevFilms = JSON.parse(localStorage.getItem("previousFilms")) || [];
      const response = await fetch(`${API_URL}/api/film/lucky`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ previousFilms: prevFilms }),
      });

      if (!response.ok) {
        throw new Error(`Uh oh... Status: ${response.status}`);
      }
      
      const data = await response.json();
      const parsedData = JSON.parse(data.result);

      // Save film titles into localStorage to send to API for future requests
      prevFilms.push(parsedData.title);
      // Keep previous film history trimmed to the last 200 films to avoid excessive localStorage usage
      if (prevFilms.length > 200) prevFilms.shift();
      localStorage.setItem("previousFilms", JSON.stringify(prevFilms));

      setFilmData(
        { 
          title: parsedData.title, 
          year: parsedData.year, 
          director: parsedData.director,
          actors: parsedData.actors,
          summary: parsedData.summary,
          notFound: false,
          reason: null
        });
    } catch(e) {
      console.log(e.message)
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Requests a film based on user-selected filters.
   * @param {Object} [searchOptions={}] Form values such as genre, decade, runtime, rating, and language.
   * @returns {Promise<void>}
   */
  async function handleGetFilmWithOptions(searchOptions={}) {
    setError(null)
    setIsLoading(true);
    const params = new URLSearchParams(searchOptions);
    
    try {
      const prevFilms = JSON.parse(localStorage.getItem("previousFilms")) || [];
      const response = await fetch(`${API_URL}/api/film/?${encodeURI(params.toString())}`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ previousFilms: prevFilms }),
      });

      if (!response.ok) {
        throw new Error(`Uh oh... Status: ${response.status}`);
      }

      const data = await response.json();
      const parsedData = JSON.parse(data.result);

      // API may return a notFound response if no films match the filters
      if (parsedData.notFound) {
        setFilmData({
          title: "", 
          year: "", 
          director: "",
          actors: "",
          summary: "",
          notFound: true,
          reason: parsedData.reason
        })
      } else {
        prevFilms.push(parsedData.title)
        if (prevFilms.length > 200) prevFilms.shift();
        localStorage.setItem("previousFilms", JSON.stringify(prevFilms))
        setFilmData(
          { 
            title: parsedData.title, 
            year: parsedData.year, 
            director: parsedData.director,
            actors: parsedData.actors,
            summary: parsedData.summary,
            notFound: false,
            reason: null
          });
      }
    } catch(e) {
      console.log(e.message)
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={styles.app}>
      <header className={styles.header}>
        <h1>
          What <span className={styles.plum}>film</span> shall <span className={styles.wisteria}>I</span> watch?
        </h1>
      </header>

      <section className={styles.actions}>
        <button onClick={handleGetFilm} disabled={isLoading}>I feel lucky punk</button>
      </section>
       
      <hr className={styles.divider} aria-hidden="true" />

      <section className={styles.filters}>
        <h3>...or finetune a suggestion.</h3>
        <FilmSelector submitHandler={handleGetFilmWithOptions}/>
      </section>

      <hr className={styles.divider} aria-hidden="true" />

      <section className={styles.results} ref={resultsRef} aria-live='polite'>
        {isLoading && <p className={styles.loading}>Thinking<span className={styles.dots}></span></p>}
        {error && <p role='alert'>{error}</p>}
        {!isLoading && !error && <Result {...filmData}/>}
      </section>
    </main>
  )
}

export default App;
