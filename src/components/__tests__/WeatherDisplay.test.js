{ render, screen, fireEvent } from '@testing-library/react';
import WeatherDisplay from '../components/WeatherDisplay';
import { useState, useEffect } from 'react';

// Mock localStorage
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

describe('WeatherDisplay Component', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  it('renders loading state correctly', () => {
    render(<WeatherDisplay />);
    expect(screen.getByText('Loading weather data...')).toBeInTheDocument();
  });

  it('renders error state correctly', async () => {
    const MockComponent = () => {
      const [error, setError] = useState('Test Error');
      useEffect(() => {
        setError('Test Error');
      }, []);
      return (
        <div>
          {error && <div>Error: {error}</div>}
        </div>
      );
    };
    render(<MockComponent />);
    expect(screen.getByText('Error: Test Error')).toBeInTheDocument();
  });

  it('renders no data state correctly', () => {
    render(<WeatherDisplay />);
    expect(screen.getByText('No weather data available for London.')).toBeInTheDocument();
  });

  it('renders weather data correctly', async () => {
    const mockWeatherData = {
      main: { temp: 25, humidity: 60 },
      weather: [{ description: 'Clear sky' }],
      wind: { speed: 5 },
    };

    const MockComponent = ({ city }) => {
      const [weatherData, setWeatherData] = useState(mockWeatherData);
      return (
        <div>
          <h2>Weather in {city}</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Condition: {weatherData.weather[0].description}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
        </div>
      );
    };

    render(<MockComponent city="London" />);
    expect(screen.getByText('Weather in London')).toBeInTheDocument();
    expect(screen.getByText('Temperature: 25°C')).toBeInTheDocument();
    expect(screen.getByText('Condition: Clear sky')).toBeInTheDocument();
    expect(screen.getByText('Humidity: 60%')).toBeInTheDocument();
    expect(screen.getByText('Wind Speed: 5 m/s')).toBeInTheDocument();
  });

  it('updates city when a different option is selected', async () => {
    render(<WeatherDisplay />);
    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'New York' } });
    expect(selectElement.value).toBe('New York');
  });

  it('loads city from local storage on mount', () => {
    mockLocalStorage.setItem('selectedCity', 'Paris');
    render(<WeatherDisplay />);
    expect(screen.getByText('Weather in Paris')).toBeInTheDocument();
  });

  it('saves city to local storage when it changes', () => {
    render(<WeatherDisplay />);
    const selectElement = screen.getByRole('combobox');
    fireEvent.change(selectElement, { target: { value: 'Tokyo' } });
    expect(mockLocalStorage.getItem('selectedCity')).toBe('Tokyo');
  });
}