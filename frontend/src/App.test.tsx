import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './pages/Home';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
