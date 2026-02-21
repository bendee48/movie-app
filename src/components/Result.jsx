function Result({ title, year, director, stars, summary, notFound}) {
  if (!title && notFound == false) {
    return null;
  }

  if (notFound) {
    return <p>Unable to find a suitable film. Try widening your search terms.</p>
  }
  
  return (
    <div className="result">
      <h3>{title} ({year}) - {director}</h3>
      <h5>Stars: {stars}</h5>
      <p>{summary}</p>
    </div>
  )
}

export default Result;