{ render, screen, fireEvent } from '@testing-library/react';
import WeatherDisplay from '../components/WeatherDisplay';
import { useState, useEffect } from 'react';

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = String(value);
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('WeatherDisplay Component', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it('renders initial city (London) if no initialCity prop is provided', () => {
    render(<WeatherDisplay />);
    expect(screen.getBytext('Weather in London')).toBeInTheDocument();
  });

  it('renders with the provided initialCity prop', () => {
    render(<WeatherDisplay initialCity="New York" />);
    expect(screen.getBytext('Weather in New York')).toBeInTheDocument();
  });

  it('loads weather data when the component mounts with a city from localStorage', () => {
    mockLocalStorage.setItem('selectedCity', 'Paris');
    render(<WeatherDisplay />);
    expect(screen.getBytext('Weather in Paris')).toBeInTheDocument();
  });

  it('updates the city and fetches weather data when a new city is selected', async () => {
    render(<WeatherDisplay />);
    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'New York' } });
    expect(screen.getBytext('Weather in New York')).toBeInTheDocument();
  });

  it('displays loading message while fetching weather data', () => {
    render(<WeatherDisplay />);
    expect(screen.getBytext('Loading weather data...')).toBeInTheDocument();
  });

  it('displays error message when weather data fails to load', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });
    global.fetch = mockFetch;

    render(<WeatherDisplay />);
    await new Promise(resolve => setTimeout(resolve, 0)); // Allow async operations to complete
    expect(screen.getBytext('Error: HTTP error! Status: 404')).toBeInTheDocument();
  });

  it('displays "No weather data available" message when weatherData is null', () => {
    render(<WeatherDisplay />);
    expect(screen.getBytext('No weather data available for London')).toBeInTheDocument();
  });

  it('displays weather data when it is available', async () => {
    const mockWeatherData = {
      main: { temp: 25, humidity: 60 },
      weather: [{ description: 'Clear sky' }],
      wind: { speed: 5 },
    };

    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockWeatherData),
    });
    global.fetch = mockFetch;

    render(<WeatherDisplay />);
    await new Promise(resolve => setTimeout(resolve, 0)); // Allow async operations to complete

    expect(screen.getBytext('Temperature: 25°C')).toBeInTheDocument();
    expect(screen.getBytext('Condition: Clear sky')).toBeInTheDocument();
    expect(screen.getBytext('Humidity: 60%')).toBeInTheDocument();
    expect(screen.getBytext('Wind Speed: 5 m/s')).toBeInTheDocument();
  });

  it('saves the selected city to localStorage', () => {
    render(<WeatherDisplay />);
    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'Tokyo' } });
    expect(mockLocalStorage.getItem('selectedCity')).toBe('Tokyo');
  });
}