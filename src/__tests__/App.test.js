{ render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import CitySelector from './CitySelector';
import WeatherDisplay from './WeatherDisplay';

// Mock localStorage
global.localStorage = {
    setItem: jest.fn(),
    getItem: jest.fn(),
};

describe('App Component', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('renders the Weather Application heading', () => {
        render(<App />);
        expect(screen.getBytext('Weather Application')).toBeInTheDocument();
    });

    it('initializes with London as the default city if local storage is empty', () => {
        render(<App />);
        expect(screen.getBytext('London')).toBeInTheDocument();
    });

    it('initializes with the city from local storage if it exists', () => {
        localStorage.setItem('selectedCity', JSON.stringify('Paris'));
        render(<App />);
        expect(screen.getBytext('Paris')).toBeInTheDocument();
    });

    it('handles errors when retrieving from local storage and falls back to London', () => {
        localStorage.setItem('selectedCity', 'invalid json');
        render(<App />);
        expect(screen.getBytext('London')).toBeInTheDocument();
    });

    it('updates the selected city when a new city is selected', () => {
        render(<App />);
        const citySelector = screen.getByrole('combobox');
        fireEvent.change(citySelector, { target: { value: 'New York' } });
        fireEvent.blur(citySelector); // Simulate losing focus to trigger the update
        expect(screen.getBytext('New York')).toBeInTheDocument();
    });

    it('fetches weather data when the selected city changes', async () => {
        const apiKey = 'YOUR_API_KEY';
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=New York&appid=${apiKey}&units=metric`;

        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ name: 'New York', main: { temp: 20 } }),
            })
        );

        render(<App />);
        const citySelector = screen.getByrole('combobox');
        fireEvent.change(citySelector, { target: { value: 'New York' } });
        fireEvent.blur(citySelector);

        await new Promise(resolve => setTimeout(resolve, 0)); // Allow state to update

        expect(global.fetch).toHaveBeenCalledWith(apiUrl);
    });

    it('handles errors during weather data fetching and displays an error message', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 404,
            })
        );

        render(<App />);
        const citySelector = screen.getByrole('combobox');
        fireEvent.change(citySelector, { target: { value: 'Invalid City' } });
        fireEvent.blur(citySelector);

        await new Promise(resolve => setTimeout(resolve, 0));

        expect(screen.getBytext('Failed to fetch weather data.')).toBeInTheDocument();
    });

    it('stores the selected city in local storage when it changes', () => {
        render(<App />);
        const citySelector = screen.getByrole('combobox');
        fireEvent.change(citySelector, { target: { value: 'Berlin' } });
        fireEvent.blur(citySelector);

        expect(localStorage.setItem).toHaveBeenCalledWith('selectedCity', JSON.stringify('Berlin'));
    });

    it('handles errors when saving to local storage', () => {
        localStorage.setItem = jest.fn(() => {
            throw new Error('Failed to save to local storage');
        });

        render(<App />);
        const citySelector = screen.getByrole('combobox');
        fireEvent.change(citySelector, { target: { value: 'Rome' } });
        fireEvent.blur(citySelector);

        expect(console.error).toHaveBeenCalledWith('Error saving city to local storage:', new Error('Failed to save to local storage'));
    });
}