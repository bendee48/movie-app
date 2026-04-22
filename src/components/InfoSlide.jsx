import { useState, useRef, useEffect } from 'react';
import styles from './InfoSlide.module.css';

const InfoSlide = () => {
  const [isOpen, setIsOpen] = useState(false);
  const slideRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleSlide = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
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
      <div ref={slideRef} className={`${styles.infoSlide} ${isOpen ? styles.open : ''}`}>
        <h2>About this app</h2>
        <p>Get film suggestions based on your preferences or, if you're feeling lucky, get a random selection.</p>
        <p><strong>How to Use:</strong> 
          <ul>
            <li>Select from various filters to get more personalized recommendations.</li>
            <li>Use the 'lucky' button to get a random suggestion.</li>
          </ul>
        </p>
        <p><strong>Important:</strong> Previous film suggestions are stored locally to your browser to promote unique films suggestions.
        Deleting browser data may result in an increase in seeing previously suggested films.</p>
        <p><strong>Privacy:</strong> All data is stored locally on your browser and is not shared with any external servers.</p>
      </div>
    </>
  );
};

export default InfoSlide;