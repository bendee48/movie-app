import { useState, useRef, useEffect } from 'react'
import styles from './App.module.css'
import Result from './Result'
import FilmSelector from './FilmSelector'

function App() {
  const [filmData, setFilmData] = useState({title: "", year: "", director: "", stars: "", summary: "", notFound: false});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (isLoading || error || filmData.title) {
      resultsRef.current.scrollIntoView({behaviour: "smooth"});
    }
  },[filmData, isLoading, error]);

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
      prevFilms.push(parsedData.title);
      // after 500 films begin to remove earlier reccomendations
      if (prevFilms.length > 500) prevFilms.shift();
      localStorage.setItem("previousFilms", JSON.stringify(prevFilms))
      setFilmData(
        { 
          title: parsedData.title, 
          year: parsedData.year, 
          director: parsedData.director,
          stars: parsedData.stars,
          summary: parsedData.summary,
          notFound: false
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
      // Set film as not found if the API can't find one
      if (parsedData.notFound == 'true') {
        setFilmData({
          title: "", 
          year: "", 
          director: "",
          stars: "",
          summary: "",
          notFound: true
        })
      } else {
        // save the film title into localStorage
        prevFilms.push(parsedData.title)
        localStorage.setItem("previousFilms", JSON.stringify(prevFilms))
        setFilmData(
          { 
            title: parsedData.title, 
            year: parsedData.year, 
            director: parsedData.director,
            stars: parsedData.stars,
            summary: parsedData.summary,
            notFound: false
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
          What <span className={styles.plum}>shall</span> <span className={styles.wisteria}>I</span> watch?</h1>
      </header>

      <section className={styles.actions}>
        <button onClick={handleGetFilm} disabled={isLoading}>I feel lucky punk</button>
      </section>
       
      <hr className={styles.divider} aria-hidden="true" />

      <section className={styles.filters}>
        <h3>...or finetune a suggestion.</h3>
        <FilmSelector submitHandler={handleSubmit}/>
      </section>

      <hr className={styles.divider} aria-hidden="true" />

      <section className={styles.results} ref={resultsRef} aria-live='polite'>
        {isLoading && <p>Thinking<span className={styles.dots}></span></p>}
        {error && <p role='alert'>{error}</p>}
        {!isLoading && !error && <Result {...filmData}/>}
      </section>
    </main>
  )
}

export default App;
