import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InfoSlide from '../components/InfoSlide';
import styles from '../components/InfoSlide.module.css'; // use css styles directly

let user;

beforeEach(() => {
  user = userEvent.setup(); // set up a user for user event actions
  render(<InfoSlide />); // render InfoSlide before each test
});

describe("InfoSlide Component", () => {

  describe("Initial render", () => {
    it("renders the info button", () => {
      expect(screen.getByRole('button', { name: '?' })).toBeInTheDocument();
    });

    it("renders the info content", () => {
      expect(screen.getByRole('heading', { name: /about this app/i })).toBeInTheDocument();
      expect(screen.getByText(/get film suggestions based on your preferences/i)).toBeInTheDocument();
      expect(screen.getByText(/how to use:/i)).toBeInTheDocument();
      expect(screen.getByText(/important:/i)).toBeInTheDocument();
      expect(screen.getByText(/privacy:/i)).toBeInTheDocument();
    });

    it("does not have the 'open' class on the slide by default", () => {
      const slide = screen.getByTestId('info-slide');
      expect(slide).not.toHaveClass(styles.open);
    });
  });

  describe("Toggling the slide", () => {
    it("adds the 'open' class when the info button is clicked", async () => {
      const button = screen.getByRole('button', { name: '?' });
      const slide = screen.getByTestId('info-slide');

      await user.click(button);

      expect(slide).toHaveClass(styles.open);
    });

    it("removes the 'open' class when the info button is clicked again", async () => {
      const button = screen.getByRole('button', { name: '?' });
      const slide = screen.getByTestId('info-slide');

      await user.click(button);
      expect(slide).toHaveClass(styles.open);

      await user.click(button);
      expect(slide).not.toHaveClass(styles.open);
    });
  });

  describe("Clicking outside the slide", () => {
    it("closes the slide when clicking outside of it while open", async () => {
      const button = screen.getByRole('button', { name: '?' });
      const slide = screen.getByTestId('info-slide');

      await user.click(button);
      expect(slide).toHaveClass(styles.open);

      await user.click(document.body);

      expect(slide).not.toHaveClass(styles.open);
    });

    it("does not close the slide when clicking inside of it", async () => {
      const button = screen.getByRole('button', { name: '?' });
      const slide = screen.getByTestId('info-slide');

      await user.click(button);
      expect(slide).toHaveClass(styles.open);

      await user.click(slide);

      expect(slide).toHaveClass(styles.open);
    });
  });
});