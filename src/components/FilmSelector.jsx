function FilmSelector() {
  return (
    <form>
      <fieldset>
        <legend>Genre</legend>
        <select name="genre" id="genre">
          <option value="action">Action</option>
          <option value="comedy">Comedy</option>
          <option value="drama">Drama</option>
          <option value="fantasy">Fantasy</option>
          <option value="horror">Horror</option>
          <option value="sci-fi">Sci Fi</option>
          <option value="thriller">Thriller</option>
          <option value="doc">Documentary</option>
        </select>
      </fieldset>
      <fieldset>
        <legend>Decade</legend>
        <select name="decade" id="decade">
          <option value="2020">2020s</option>
          <option value="2010">2010s</option>
          <option value="2000">2000s</option>
          <option value="90">90s</option>
          <option value="80">80s</option>
          <option value="70">70s</option>
          <option value="60">60s</option>
          <option value="50">50s</option>
          <option value="pre50">pre 50s</option>
        </select>
      </fieldset>
      <fieldset>
        <legend>Runtime</legend>
        <select name="runtime" id="runtime">
          <option value="length90">around 90 mins</option>
          <option value="length2hours">less than 2 hours</option>
          <option value="length3hours">less than 3 hours</option>
          <option value="lengthAny">any length</option>
        </select>
      </fieldset>
      <fieldset>
        <legend>Decade</legend>
        <select name="decade" id="decade">
          <option value="rating9">9 or higher</option>
          <option value="rating8">8 or higher</option>
          <option value="rating7">7 or higher</option>
          <option value="rating6">6 or higher</option>
          <option value="rating5">5 or higher</option>
          <option value="ratingLessThan5">less than 5</option>
        </select>
      </fieldset>
    </form>
  )
}

export default FilmSelector;