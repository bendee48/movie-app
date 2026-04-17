import {useRef, useEffect } from 'react';
import styles from './Result.module.css';

function Result({ title, year, director, stars, summary, notFound}) {
  const resultRef = useRef(null);

  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behaviour: "smooth"});
    }
  },[]);

  if (!title && notFound == false) {
    return null;
  }

  if (notFound) {
    return (
      <div ref={resultRef} className={styles.result}>
        <p>Unable to find a suitable film. Try widening your search terms.</p>
      </div>
    )  
  } else {
    return (
      <div ref={resultRef} className={styles.result}>
        <h3>{title} ({year}) - {director}</h3>
        <h5>Stars: {stars}</h5>
        <p>{summary}</p>
      </div>
    )
  }
  
}

export default Result;