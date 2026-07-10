import {useRef, useEffect } from 'react';
import styles from './Result.module.css';

function Result({ title, year, director, actors, summary, streaming, notFound, reason}) {
  const resultRef = useRef(null);

  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth"});
    }
  },[]);

  // make sure nothing is displayed on page load
  if (notFound && reason == null) {
    return null;
  }

  if (notFound) {
    return (
      <div ref={resultRef} className={styles.result}>
        <p>Unable to find a suitable film.</p>
        <p>Reasoning: {reason}</p>
        <p>Try widening your search terms.</p>
      </div>
    )  
  } else {
    return (
      <div ref={resultRef} className={styles.result}>
        <h3>{title} ({year}) - {director}</h3>
        <h5>Stars: {actors}</h5>
        <p>{summary}</p>
        {/* <h4>Where to watch</h4>
        { 
          streaming.length > 0 && streaming[0].service != "" ? (
            streaming.map((item, index) => (
              <p key={index}>{item.service} - <a href={item.url} target="_blank">Watch on {item.service}</a></p>
            ))
          ) : (
            <p>No streaming information available</p>
          )
        } */}
      </div>
    )
  }
  
}

export default Result;