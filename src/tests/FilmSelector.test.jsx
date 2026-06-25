import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FilmSelector from '../components/FilmSelector';

let user;
let submitMock;

beforeEach(() => {
  user = userEvent.setup(); // set up a user for user event actions
  submitMock = vi.fn(); // setup a mock for the submit handler passed to FilmSelector
  render(<FilmSelector submitHandler={submitMock}/>); // render FilmSelector with the mock before each test
});

describe("FilmSelector Component", () => {

  describe("Initial render", () => {
    it("renders the select options with their disabled 'select an option' selected as default", () => {  
      expect(screen.getByRole('combobox', { name: /genre/i })).toHaveValue('');
      expect(screen.getByRole('combobox', { name: /decade/i })).toHaveValue('');
      expect(screen.getByRole('combobox', { name: /runtime/i })).toHaveValue('');
      expect(screen.getByRole('combobox', { name: /rating/i })).toHaveValue('');
      expect(screen.getByRole('combobox', { name: /language/i })).toHaveValue('');
    })
  
    it('renders the submit button', () => {
      expect(screen.getByRole('button', { name: /suggest film/i })).toBeInTheDocument();
    })
  })

  describe("Submit handler is called when form is submitted", () => {
    it('calls the submit handler with blank data when no options are selected', async () => {
      const submitButton = screen.getByRole('button', { name: /suggest film/i })
      await user.click(submitButton);

      expect(submitMock).toHaveBeenCalledWith({
        "decade": "",
        "genre": "",
        "language": "",
        "rating": "",
        "runtime": ""
      });
    });

    it('calls the submit handler with filled data when options are selected', async () => {
      const genreSelect = screen.getByRole('combobox', { name: /genre/i });
      await user.selectOptions(genreSelect, 'sci-fi');
      const decadeSelect = screen.getByRole('combobox', { name: /decade/i });
      await user.selectOptions(decadeSelect, '90s');
      const runtimeSelect = screen.getByRole('combobox', { name: /runtime/i });
      await user.selectOptions(runtimeSelect, 'any length');
      const ratingSelect = screen.getByRole('combobox', { name: /rating/i });
      await user.selectOptions(ratingSelect, 'higher than 7');
      const languageSelect = screen.getByRole('combobox', { name: /language/i });
      await user.selectOptions(languageSelect, 'english');
      const submitButton = screen.getByRole('button', { name: /suggest film/i })
      await user.click(submitButton);

      expect(submitMock).toHaveBeenCalledWith({
        "decade": "90s",
        "genre": "sci-fi",
        "language": "english",
        "rating": "higher than 7",
        "runtime": "any length"
      });
    });
  });
});
