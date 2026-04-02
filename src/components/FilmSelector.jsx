import styles from './FilmSelector.module.css'

function FilmSelector({submitHandler}) {
  return (
    <form onSubmit={submitHandler} className={styles.form_selector}>
      <fieldset className={styles.fieldset}>
        <legend>Genre</legend>
        <select name="genre" id="genre">
          <option value="" disabled selected>Select a genre</option>
          <option value="any genre">any genre</option>
          <option value="action">Action</option>
          <option value="comedy">Comedy</option>
          <option value="drama">Drama</option>
          <option value="fantasy">Fantasy</option>
          <option value="horror">Horror</option>
          <option value="sci-fi">Sci Fi</option>
          <option value="thriller">Thriller</option>
          <option value="documentary">Documentary</option>
        </select>
      </fieldset>
      <fieldset>
        <legend>Decade</legend>
        <select name="decade" id="decade">
          <option value="" disabled selected>Select a decade</option>
          <option value="any decade">any decade</option>
          <option value="2020s">2020s</option>
          <option value="2010s">2010s</option>
          <option value="2000s">2000s</option>
          <option value="90s">90s</option>
          <option value="80s">80s</option>
          <option value="70s">70s</option>
          <option value="60s">60s</option>
          <option value="50s">50s</option>
          <option value="pre 50s">pre 50s</option>
        </select>
      </fieldset>
      <fieldset>
        <legend>Runtime</legend>
        <select name="runtime" id="runtime">
          <option value="" disabled selected>Select a runtime</option>
          <option value="any length">any length</option>
          <option value="around 90 mins">around 90 mins</option>
          <option value="less than 180 mins">less than 2 hours</option>
          <option value="less than 270 mins">less than 3 hours</option>
        </select>
      </fieldset>
      <fieldset>
        <legend>IMDB Rating</legend>
        <select name="rating" id="rating">
          <option value="" disabled selected>Select a rating</option>
          <option value="any rating">any rating</option>
          <option value="higher than 9">9 or higher</option>
          <option value="higher than 8">8 or higher</option>
          <option value="higher than 7">7 or higher</option>
          <option value="higher than 6">6 or higher</option>
          <option value="higher than 5">5 or higher</option>
          <option value="less than 5">less than 5</option>
        </select>
      </fieldset>
      <fieldset>
        <legend>Language</legend>
        <select name="language" id="language">
          <option value="" disabled selected>Select a language</option>
          <option value="any language">any language</option>
          <option value="english">English</option>
          <option value="french">French</option>
          <option value="spanish">Spanish</option>
          <option value="portuguese">Portuguese</option>
          <option value="japanese">Japanese</option>
          <option value="korean">Korean</option>
          <option value="chinese">Chinese</option>
          <option value="arabic">Arabic</option>
          <option value="italian">Italian</option>
          <option value="german">German</option>
          <option value="swedish">Swedish</option>
          <option value="danish">Danish</option>
          <option value="norwegian">Norwegian</option>
        </select>
      </fieldset>
      <div className={styles.break}></div>
      <button type="submit" className={styles.submit}>Suggest Film</button>
    </form>
  )
}

export default FilmSelector;