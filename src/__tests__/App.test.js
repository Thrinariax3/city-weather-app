{ render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import CitySelector from './CitySelector';
import WeatherDisplay from './WeatherDisplay';

// Mock localStorage
global.localStorage = {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};

describe('App Component', () => {
    beforeEach(() => {
        localStorage.clear(); // Clear local storage before each test
    });

    it('renders the Weather Application heading', () => {
        render(<App />);
        const headingElement = screen.getByText(/Weather Application/i);
        expect(headingElement).toBeInTheDocument();
    });

    it('initializes with London as the default city if local storage is empty', () => {
        render(<App />);
        expect(screen.getBytext('London')).toBeInTheDocument();
    });

    it('loads city from local storage if available', () => {
        localStorage.setItem('selectedCity', JSON.stringify('Paris'));
        render(<App />);
        expect(screen.getBytext('Paris')).toBeInTheDocument();
    });

    it('handles errors when retrieving from local storage and falls back to London', () => {
        localStorage.setItem('selectedCity', 'invalid json');
        render(<App />);
        expect(screen.getBytext('London')).toBeInTheDocument();
    });

    it('calls handleCityChange when a city is selected in CitySelector', async () => {
        render(<App />);
        const citySelector = screen.getByrole('combobox');
        fireEvent.change(citySelector, { target: { value: 'New York' } });
        fireEvent.select(citySelector, 'New York');

        // Wait for the state to update and the effect to run
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(screen.getBytext('New York')).toBeInTheDocument();
    });

    it('fetches weather data when the selected city changes', async () => {
        const mockWeatherData = {
            name: 'Test City',
            main: { temp: 25 },
            weather: [{ description: 'Clear sky' }],
        };

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockWeatherData),
        });

        render(<App />);
        const citySelector = screen.getByrole('combobox');
        fireEvent.change(citySelector, { target: { value: 'Test City' } });
        fireEvent.select(citySelector, 'Test City');

        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(screen.getBytext('Test City')).toBeInTheDocument();
        expect(screen.getBytext('25')).toBeInTheDocument();
        expect(screen.getBytext('Clear sky')).toBeInTheDocument();
    });

    it('handles weather data fetch errors and displays an error message', async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 404,
        });

        render(<App />);
        const citySelector = screen.getByrole('combobox');
        fireEvent.change(citySelector, { target: { value: 'NonExistentCity' } });
        fireEvent.select(citySelector, 'NonExistentCity');

        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(screen.getBytext('Failed to fetch weather data.')).toBeInTheDocument();
    });

    it('saves the selected city to local storage', () => {
        render(<App />);
        const citySelector = screen.getByrole('combobox');
        fireEvent.change(citySelector, { target: { value: 'Berlin' } });
        fireEvent.select(citySelector, 'Berlin');

        expect(localStorage.setItem).toHaveBeenCalledWith('selectedCity', JSON.stringify('Berlin'));
    });
}