import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Result from '../components/Result';


// jsdom doesn't support scrollIntoView so I've mocked this out
const mockScrollIntoView = vi.fn();
window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

describe("Result Component", () => {

  describe("Rendering Film Data", () => {
    describe("Film Data Provided", () => {
      it('renders the correct film information', () => {
        const mockFilmData = {
          title: "Y Tu Mamá También",
          year: "2001",
          director: "Alfonso Cuarón",
          actors: "Maribel Verdú, Gael García Bernal, Diego Luna",
          summary: "In Mexico, two teenage boys and an attractive older woman embark on a road trip and learn a thing or two about life, friendship, sex, and each other.",
          notFound: false,
          reason: null
        }
  
        render(<Result {...mockFilmData}/>)
  
        expect(screen.getByRole('heading', { level: 3, name: "Y Tu Mamá También (2001) - Alfonso Cuarón"})).toBeInTheDocument();
        expect(screen.getByRole('heading', { level: 5, name: "Stars: Maribel Verdú, Gael García Bernal, Diego Luna"})).toBeInTheDocument();
        expect(screen.getByText(/In Mexico, two teenage boys/i)).toBeInTheDocument();
      })
    });

    describe("Film data not provided", () => {
      it("renders information explaining why a film wasn't found", () => {
        const mockFilmData = {
          title: "",
          year: "",
          director: "",
          actors: "",
          summary: "",
          notFound: true,
          reason: "Couldn't find any films about extreme knitting, in Korean from before the 1950s."
        }

        render(<Result {...mockFilmData}/>);

        expect(screen.getByText("Unable to find a suitable film.")).toBeInTheDocument();
        expect(screen.getByText("Reasoning: Couldn't find any films about extreme knitting, in Korean from before the 1950s.")).toBeInTheDocument();
        expect(screen.getByText("Try widening your search terms.")).toBeInTheDocument();
      })

      it("renders nothing if no film information is provided with no reason", () => {
        const mockFilmData = {
          title: "",
          year: "",
          director: "",
          actors: "",
          summary: "",
          notFound: true,
          reason: null
        }

        const { container } = render(<Result {...mockFilmData}/>)

        expect(container).toBeEmptyDOMElement();
      })
    })
  })

  describe("scrollIntoView is called when the component is mounted", () => {
    it("calls scroll into view with the correct behaviour", () => {
      render(<Result/>)
  
      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
    })
  })
})