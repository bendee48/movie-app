import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../components/App';
import FilmSelector from '../components/FilmSelector';

// jsdom doesn't support scrollIntoView so I've mocked this out
const mockScrollIntoView = vi.fn();
window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

describe('App Component', () => {

  beforeEach(() => {
    // mock a fresh fetch
    vi.stubGlobal('fetch', vi.fn());
    // jsdom provides a fully functional localStorage, just needs clearing between tests
    localStorage.clear();
  })

  describe('Initial Render', () => {
    it('renders the initial layout correctly', () => {
      render(<App/>)
      
      expect(screen.getByRole('heading', { name: /what shall i watch\?/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /i feel lucky/i })).toBeInTheDocument();
      // check for the presence of the FilmSelector component
      expect(screen.getByRole('button', { name: /suggest film/i })).toBeInTheDocument();
    })
  });

  describe('Successful fetches', () => {
    it('successfully fetches and displays a film using the "I feel lucky" button', async () => {
      const user = userEvent.setup();

      const mockFilmData = {
          title: "Jurassic Park",
          year: "1993",
          director: "Steven Speilberg",
          actors: "Sam Neill, Laura Dern, Jeff Goldblum",
          summary: "Dinosuars eat people...",
          streaming: [
            { "service": "Mubi", "url": "www.mubi.com/j-park" }
          ]
        }

      // adding a timeout to simulate the request taking a little while, to test loading states etc
      fetch.mockImplementationOnce(() => 
        new Promise((resolve) => 
          setTimeout(() => 
            resolve({
              ok: true,
              json: async () => ({ result: JSON.stringify(mockFilmData) }),
            }), 
            50
          )
        )
      );

      render(<App/>);

      // click lucky button
      const luckyButton = screen.getByRole('button', { name: /i feel lucky/i });
      await user.click(luckyButton);

      // verify loading state
      expect(luckyButton).toBeDisabled();
      expect(screen.getByText(/thinking/i)).toBeInTheDocument();
      expect(mockScrollIntoView).toHaveBeenCalledWith({behavior: "smooth"});

      // verify loading ends and results are displayed
      await waitForElementToBeRemoved(() => screen.queryByText(/thinking/i))
      await screen.findByRole('heading', { name: /Jurassic Park/i });

      // verify localstorage is updated
      expect(localStorage.getItem("previousFilms")).toContain("Jurassic Park");
    })

    it("successfully displays a film using the 'suggest film' button", async () => {
      const user = userEvent.setup();

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({result: JSON.stringify({ title: 'The Matrix' })})
      });

      render(<App/>);

      // select options from the film selector component
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
      
      // click suggest film button
      const suggestFilmButton = screen.getByRole('button', { name: /suggest film/i });
      await user.click(suggestFilmButton);

      // verify the api is called with the params from the user's selected options
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("genre=sci-fi&decade=90s&runtime=any+length&rating=higher+than+7&language=english"),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json"},
          body: JSON.stringify({ previousFilms: [] }),
        })
      )

      // verify UI updated
      await screen.findByRole('heading', { name: /The Matrix/i });
    })
  })

  describe('Unsuccessful fetches', () => {
    it('displays an error message if a fetch fails', async () => {
      const user = userEvent.setup();

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      render(<App/>);

      // click lucky button
      const luckyButton = screen.getByRole('button', { name: /i feel lucky/i });
      await user.click(luckyButton);

      const alertMsg = screen.getByRole('alert');
      expect(alertMsg).toHaveTextContent('Uh oh... Status: 500')
    })
  })
});