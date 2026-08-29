# What Film Shall I Watch?

A movie recommendation app.

Gives users a quick way to decide what film to watch by offering either a random “lucky pick” or a more tailored recommendation based on filters like genre, decade, runtime, rating, and language.

## Overview

The app is designed as a lightweight, user-friendly film discovery experience. 

This is the React frontend which speaks to an AI backed [Express API Backend](https://github.com/bendee48/movie-api) which handles the reccomendations.

## Features

- One-click “I feel lucky” film recommendation
- Filtered recommendations by genre, decade, runtime, IMDb rating, and language
- Clean result display with title, year, director, cast, and summary
- Loading and error states
- LocalStorage-based recommendation history to avoid repeat suggestions
- Responsive styling

## Tech Stack

- React
- Vite
- JavaScript
- CSS Modules
- Vitest
- Testing Library
- ESLint

## How it works

1. The user either clicks the lucky-button or fills in search filters.
2. The browser sends the request to the movie API.
3. A film recommendation is returned and displayed in the UI.
4. If no movie matches the criteria, the app shows a helpful message and invites the user to widen the search.

## Local setup

To run the project locally:

```bash
npm install
npm run dev
```

To run the tests:

```bash
npm run tests
```

## Environment

This project expects a movie API base URL to be available through the VITE_API_URL environment variable.

Example:

```bash
VITE_API_URL=http://localhost:3000
```

## Live Version
[What Film Shall I Watch?](https://whatfilmshalliwatch.netlify.app/)

