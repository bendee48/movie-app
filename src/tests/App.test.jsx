import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../components/App';

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

      expect(screen.getByRole('heading', { name: /what film shall i watch\?/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /i feel lucky/i })).toBeInTheDocument();
      // check for the presence of the FilmSelector component
      expect(screen.getByRole('button', { name: /suggest film/i })).toBeInTheDocument();
    })
  });

  describe('"I feel lucky" endpoint', () => {
    it('successfully fetches and displays a film', async () => {
      const user = userEvent.setup();

      const mockFilmData = {
          title: "Jurassic Park",
          year: "1993",
          director: "Steven Spielberg",
          actors: "Sam Neill, Laura Dern, Jeff Goldblum",
          summary: "Dinosaurs eat people...",
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
      expect(luckyButton).toBeEnabled();

      // verify localstorage is updated
      expect(localStorage.getItem("previousFilms")).toContain("Jurassic Park");
    })

    it("includes previous films from localStorage in the POST request", async () => {
      const user = userEvent.setup();

      // seed localStorage with some existing data
      const mockHistory = ['Jurassic Park', 'The Matrix'];
      localStorage.setItem('previousFilms', JSON.stringify(mockHistory));

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: JSON.stringify({ title: 'Little Shop of Horrors' }) })
      });

      render(<App/>);

      // click lucky button
      const luckyButton = screen.getByRole('button', { name: /i feel lucky/i });
      await user.click(luckyButton);

      // check the API is called with the previous films data
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ previousFilms: mockHistory }),
        })
      );

      // final check that localStorage updates correctly
      const updatedHistory = JSON.parse(localStorage.getItem('previousFilms'));
      expect(updatedHistory).toEqual(['Jurassic Park', 'The Matrix', 'Little Shop of Horrors']);
    })

    it("caps the localStorage history at 500 films via the lucky endpoint, dropping the oldest entry", async () => {
      const user = userEvent.setup();

      // seed localStorage with 500 existing entries
      const mockHistory = Array.from({ length: 500 }, (_, i) => `Film ${i}`);
      localStorage.setItem('previousFilms', JSON.stringify(mockHistory));

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: JSON.stringify({ title: 'The New Film' }) })
      });

      render(<App/>);

      const luckyButton = screen.getByRole('button', { name: /i feel lucky/i });
      await user.click(luckyButton);

      await screen.findByRole('heading', { name: /The New Film/i });

      const updatedHistory = JSON.parse(localStorage.getItem('previousFilms'));

      // still capped at 500, oldest entry ("Film 0") dropped, newest entry appended
      expect(updatedHistory).toHaveLength(500);
      expect(updatedHistory).not.toContain('Film 0');
      expect(updatedHistory[0]).toBe('Film 1');
      expect(updatedHistory[updatedHistory.length - 1]).toBe('The New Film');
    })

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

      // verify error message is displayed in results section
      const alertMsg = screen.getByRole('alert');
      expect(alertMsg).toHaveTextContent('Uh oh... Status: 500')
    })

    it("displays an error message if there's a network error", async () => {
      const user = userEvent.setup();

      fetch.mockRejectedValueOnce(new Error('Network Error'));

      render(<App/>);

      // click lucky button
      const luckyButton = screen.getByRole('button', { name: /i feel lucky/i });
      await user.click(luckyButton);

      // verify error message is displayed in results section
      const alertMsg = screen.getByRole('alert');
      expect(alertMsg).toHaveTextContent('Network Error');
    })

    it("displays an error message if JSON is malformed", async () => {
      const user = userEvent.setup();

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => { throw new SyntaxError('Unexpected token')}
      });

      render(<App/>);

       // click lucky button
      const luckyButton = screen.getByRole('button', { name: /i feel lucky/i });
      await user.click(luckyButton);

      // verify error message is displayed in results section
      const alertMsg = screen.getByRole('alert');
      expect(alertMsg).toHaveTextContent('Unexpected token');
    })
  })

  describe('"Suggest film" endpoint', () => {
    it("successfully displays a film with selected filter options", async () => {
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

    it("caps the localStorage history at 500 films via the suggest endpoint, dropping the oldest entry", async () => {
      const user = userEvent.setup();

      // seed localStorage with 500 existing entries
      const mockHistory = Array.from({ length: 500 }, (_, i) => `Film ${i}`);
      localStorage.setItem('previousFilms', JSON.stringify(mockHistory));

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: JSON.stringify({ title: 'The New Film' }) })
      });

      render(<App/>);

      const suggestFilmButton = screen.getByRole('button', { name: /suggest film/i });
      await user.click(suggestFilmButton);

      await screen.findByRole('heading', { name: /The New Film/i });

      const updatedHistory = JSON.parse(localStorage.getItem('previousFilms'));

      expect(updatedHistory).toHaveLength(500);
      expect(updatedHistory).not.toContain('Film 0');
      expect(updatedHistory[0]).toBe('Film 1');
      expect(updatedHistory[updatedHistory.length - 1]).toBe('The New Film');
    })

    it("displays a not-found message with reason when the API can't find a matching film", async () => {
      const user = userEvent.setup();

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: JSON.stringify({ notFound: true, reason: "No films match those filters" }) })
      });

      render(<App/>);

      const suggestFilmButton = screen.getByRole('button', { name: /suggest film/i });
      await user.click(suggestFilmButton);

      expect(await screen.findByText(/no films match those filters/i)).toBeInTheDocument();
    })

    it('displays an error message if a fetch fails', async () => {
      const user = userEvent.setup();

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      render(<App/>);

      const suggestFilmButton = screen.getByRole('button', { name: /suggest film/i });
      await user.click(suggestFilmButton);

      const alertMsg = screen.getByRole('alert');
      expect(alertMsg).toHaveTextContent('Uh oh... Status: 500')
    })
  })
});