import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../components/App';

describe('App', () => {
  it('renders headline', () => {
    render(<App />);
  });
});