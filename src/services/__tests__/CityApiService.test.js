{ CityApiService } from '../services/CityApiService';
import axios from 'axios';

jest.mock('axios');
jest.mock('localStorage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(),
}));

describe('CityApiService', () => {
    let cityApiService;

    beforeEach(() => {
        cityApiService = new CityApiService();
    });

    describe('getCities', () => {
        it('should fetch a list of cities successfully', async () => {
            const mockCities = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney'];
            axios.get.mockResolvedValue({ data: {} }); // Mock axios response
            const cities = await cityApiService.getCities();
            expect(cities).toEqual(mockCities);
            expect(axios.get).toHaveBeenCalledTimes(1);
        });

        it('should throw an error if the API request fails', async () => {
            axios.get.mockRejectedValue(new Error('API error'));
            await expect(cityApiService.getCities()).rejects.toThrow('Failed to fetch cities.');
            expect(axios.get).toHaveBeenCalledTimes(1);
        });
    });

    describe('storeSelectedCity', () => {
        it('should store the selected city in local storage successfully', () => {
            const city = 'London';
            cityApiService.storeSelectedCity(city);
            expect(localStorage.setItem).toHaveBeenCalledWith('selectedCity', city);
        });

        it('should throw an error if local storage is unavailable', () => {
            localStorage.setItem.mockImplementation(() => { throw new Error('Local storage error'); });
            expect(() => cityApiService.storeSelectedCity('London')).toThrow('Failed to store selected city in local storage.');
        });
    });

    describe('getSelectedCity', () => {
        it('should retrieve the selected city from local storage', () => {
            localStorage.getItem.mockReturnValue('Paris');
            const city = cityApiService.getSelectedCity();
            expect(city).toBe('Paris');
            expect(localStorage.getItem).toHaveBeenCalledWith('selectedCity');
        });

        it('should return null if no city is selected', () => {
            localStorage.getItem.mockReturnValue(null);
            const city = cityApiService.getSelectedCity();
            expect(city).toBeNull();
            expect(localStorage.getItem).toHaveBeenCalledWith('selectedCity');
        });
    });

    describe('updateWeatherForecast', () => {
        it('should update the weather forecast data successfully', async () => {
            const city = 'London';
            const mockWeatherData = { temperature: 20, condition: 'Sunny' };
            const updateWeatherCallback = jest.fn();
            axios.get.mockResolvedValue({ data: mockWeatherData });
            await cityApiService.updateWeatherForecast(city, updateWeatherCallback);
            expect(updateWeatherCallback).toHaveBeenCalledWith(mockWeatherData);
            expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}?q=${city}&appid=${API_KEY}`);
        });

        it('should throw an error if the API request fails', async () => {
            const city = 'London';
            const updateWeatherCallback = jest.fn();
            axios.get.mockRejectedValue(new Error('API error'));
            await expect(cityApiService.updateWeatherForecast(city, updateWeatherCallback)).rejects.toThrow('Failed to fetch weather data.');
            expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}?q=${city}&appid=${API_KEY}`);
        });
    });
}