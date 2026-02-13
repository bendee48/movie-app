function Result({ title, year, director, summary}) {
  if (!title) {
    return null;
  }
  
  return (
    <div className="result">
      <h3>{title} ({year}) - {director}</h3>
      <p>{summary}</p>
    </div>
  )
}

export default Result;