{ render, screen, fireEvent } from '@testing-library/react';
import CitySelector from '../components/CitySelector';

// Mock the localStorage object to prevent actual storage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = String(value);
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('CitySelector Component', () => {
  const mockOnCityChange = jest.fn();

  beforeEach(() => {
    mockOnCityChange.mockClear();
  });

  it('renders the city selector with a default option', () => {
    render(<CitySelector onCityChange={mockOnCityChange} />);
    const selectElement = screen.getByRole('combobox');
    const defaultOption = screen.getByText('-- Select a City --');
    expect(selectElement).toBeInTheDocument();
    expect(defaultOption).toBeInTheDocument();
  });

  it('renders city options when cities are fetched', async () => {
    // Mock the fetch function to return a successful response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(['New York', 'Los Angeles', 'Chicago']),
      })
    );

    render(<CitySelector onCityChange={mockOnCityChange} />);
    await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for useEffect to complete

    const newYorkOption = screen.getByText('New York');
    const losAngelesOption = screen.getByText('Los Angeles');
    const chicagoOption = screen.getByText('Chicago');

    expect(newYorkOption).toBeInTheDocument();
    expect(losAngelesOption).toBeInTheDocument();
    expect(chicagoOption).toBeInTheDocument();
  });

  it('calls onCityChange prop when a city is selected', async () => {
    // Mock the fetch function to return a successful response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(['New York', 'Los Angeles', 'Chicago']),
      })
    );

    render(<CitySelector onCityChange={mockOnCityChange} />);
    await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for useEffect to complete

    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'New York' } });

    expect(mockOnCityChange).toHaveBeenCalledTimes(1);
    expect(mockOnCityChange).toHaveBeenCalledWith('New York');
  });

  it('sets and retrieves the selected city from localStorage', async () => {
    // Mock the fetch function to return a successful response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(['New York', 'Los Angeles', 'Chicago']),
      })
    );

    render(<CitySelector onCityChange={mockOnCityChange} />);
    await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for useEffect to complete

    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'Los Angeles' } });

    expect(mockLocalStorage.getItem('selectedCity')).toBe('Los Angeles');
  });

  it('displays an error message when the API fetch fails', async () => {
    // Mock the fetch function to return an error response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    );

    render(<CitySelector onCityChange={mockOnCityChange} />);
    await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for useEffect to complete

    const errorMessage = screen.getByText(/Error:/i);
    expect(errorMessage).toBeInTheDocument();
  });

  it('handles initial selected city from localStorage', () => {
    mockLocalStorage.setItem('selectedCity', 'Chicago');
    render(<CitySelector onCityChange={mockOnCityChange} />);

    const selectElement = screen.getByRole('combobox');
    expect(selectElement.value).toBe('Chicago');
  });
}