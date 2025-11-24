import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Jenkins learning message', () => {
  render(<App />);
  const linkElement = screen.getByText(/Dhruv is learning jenkins, be patient/i);
  expect(linkElement).toBeInTheDocument();
});
