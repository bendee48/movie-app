import {useRef, useEffect } from 'react';
import styles from './Result.module.css';

function Result({ title, year, director, stars, summary, streaming, notFound}) {
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
        <h5>Where to watch</h5>
        { 
          streaming && streaming.length > 0 ? (
            streaming.map((item, index) => (
              <p key={index}>{item.service} - <a href={item.url} target="_blank">Watch on {item.service}</a></p>
            ))
          ) : (
            <p>No streaming information available</p>
          )
        }
      </div>
    )
  }
  
}

export default Result;