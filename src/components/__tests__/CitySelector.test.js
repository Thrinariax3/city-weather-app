{ render, screen, fireEvent } from '@testing-library/react';
import CitySelector from '../components/CitySelector';

// Mock the fetch API
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve(['New York', 'Los Angeles', 'Chicago']),
    })
);

describe('CitySelector Component', () => {
    beforeEach(() => {
        localStorage.clear(); // Clear local storage before each test
    });

    it('renders the city selector with a default "Select a City" option', () => {
        render(<CitySelector onCityChange={() => {}} />);
        const selectElement = screen.getByRole('combobox');
        expect(selectElement).toBeInTheDocument();
        const defaultOption = screen.getByText('-- Select a City --');
        expect(defaultOption).toBeInTheDocument();
    });

    it('fetches cities from the API and populates the dropdown', async () => {
        render(<CitySelector onCityChange={() => {}} />);
        await new Promise(resolve => setTimeout(resolve, 0)); // Allow useEffect to run
        const cityOptions = screen.getAllByRole('option');
        expect(cityOptions.length).toBe(4); // Includes the default option
        expect(cityOptions[1]).toHaveTextContent('New York');
        expect(cityOptions[2]).toHaveTextContent('Los Angeles');
        expect(cityOptions[3]).toHaveTextContent('Chicago');
    });

    it('calls onCityChange with the selected city when an option is chosen', () => {
        const onCityChangeMock = jest.fn();
        render(<CitySelector onCityChange={onCityChangeMock} />);
        await new Promise(resolve => setTimeout(resolve, 0)); // Allow useEffect to run

        const cityOptions = screen.getAllByRole('option');
        fireEvent.change(cityOptions[1], { target: { value: 'New York' } });

        expect(onCityChangeMock).toHaveBeenCalledTimes(1);
        expect(onCityChangeMock).toHaveBeenCalledWith('New York');
    });

    it('saves the selected city to localStorage', () => {
        render(<CitySelector onCityChange={() => {}} />);
        await new Promise(resolve => setTimeout(resolve, 0)); // Allow useEffect to run

        const cityOptions = screen.getAllByRole('option');
        fireEvent.change(cityOptions[1], { target: { value: 'New York' } });

        expect(localStorage.getItem('selectedCity')).toBe('New York');
    });

    it('loads the selected city from localStorage on initial render', () => {
        localStorage.setItem('selectedCity', 'Los Angeles');
        render(<CitySelector onCityChange={() => {}} />);
        await new Promise(resolve => setTimeout(resolve, 0)); // Allow useEffect to run

        const selectElement = screen.getByRole('combobox');
        expect(selectElement.value).toBe('Los Angeles');
    });

    it('displays an error message when the API request fails', async () => {
        // Mock fetch to reject
        global.fetch.mockRejectedValue(new Error('API Error'));

        render(<CitySelector onCityChange={() => {}} />);
        await new Promise(resolve => setTimeout(resolve, 0)); // Allow useEffect to run

        const errorMessage = screen.getByText('Error: API Error');
        expect(errorMessage).toBeInTheDocument();
    });
}