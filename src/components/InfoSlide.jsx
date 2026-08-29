import { useState, useRef, useEffect } from 'react';
import styles from './InfoSlide.module.css';

/**
 * A floating help panel for explaining how the app works and clarifying privacy/history behavior.
 * It opens from a question-mark button and closes when the user clicks outside the panel.
 */
const InfoSlide = () => {
  const [isOpen, setIsOpen] = useState(false);
  const slideRef = useRef(null);
  const buttonRef = useRef(null);

  /**
   * Toggles the visibility of the info panel.
   */
  const toggleSlide = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    /**
     * Closes the panel when a click event happens outside the slide content or trigger button.
     * @param {MouseEvent} event - The click event used to detect outside interaction.
     */
    const handleClickOutside = (event) => {
      if (slideRef.current && !slideRef.current.contains(event.target) && event.target !== buttonRef.current) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <button ref={buttonRef} className={styles.infoButton} onClick={toggleSlide}>
        ?
      </button>
      <div ref={slideRef} data-testid="info-slide" className={`${styles.infoSlide} ${isOpen ? styles.open : ''}`}>
        <h2>About this app</h2>
        <p>Get film suggestions based on your preferences or, if you're feeling lucky, get a random selection.</p>
        <p><strong>How to Use:</strong></p>
        <ul>
          <li>Select from various filters to get more personalized recommendations.</li>
          <li>Use the 'lucky' button to get a random suggestion.</li>
        </ul>
        <p><strong>Important:</strong> Previous film suggestions are stored locally to your browser to promote unique films suggestions.
        Deleting browser data may result in an increase in seeing previously suggested films.</p>
        <p><strong>Privacy:</strong> Your preferences are sent to our API, which uses AI to generate film recommendations. Your recommendation history is stored locally in your browser.</p>
      </div>
    </>
  );
};

export default InfoSlide;