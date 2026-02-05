{ CityApiService } from '../services/CityApiService';
import axios from 'axios';

// Mock axios to avoid real API calls
jest.mock('axios');

describe('CityApiService', () => {
  let cityApiService;

  beforeEach(() => {
    cityApiService = new CityApiService();
    // Clear local storage before each test
    localStorage.clear();
  });

  describe('getCities', () => {
    it('should fetch a list of cities successfully', async () => {
      const mockCities = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney'];
      axios.get.mockResolvedValue({ data: {} }); // Mock axios response
      const cities = await cityApiService.getCities();
      expect(cities).toEqual(mockCities);
    });

    it('should throw an error if the API request fails', async () => {
      axios.get.mockRejectedValue(new Error('API error'));
      await expect(cityApiService.getCities()).rejects.toThrow('Failed to fetch cities.');
    });
  });

  describe('storeSelectedCity', () => {
    it('should store the selected city in local storage', () => {
      const city = 'Berlin';
      cityApiService.storeSelectedCity(city);
      expect(localStorage.getItem('selectedCity')).toBe(city);
    });

    it('should throw an error if local storage is unavailable', () => {
      // Mock localStorage to throw an error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn().mockImplementation(() => { throw new Error('Local storage error'); });

      const city = 'Rome';
      await expect(cityApiService.storeSelectedCity(city)).rejects.toThrow('Failed to store selected city in local storage.');

      // Restore original localStorage
      localStorage.setItem = originalSetItem;
    });
  });

  describe('getSelectedCity', () => {
    it('should retrieve the selected city from local storage', () => {
      localStorage.setItem('selectedCity', 'Madrid');
      const city = cityApiService.getSelectedCity();
      expect(city).toBe('Madrid');
    });

    it('should return null if no city is selected', () => {
      const city = cityApiService.getSelectedCity();
      expect(city).toBeNull();
    });
  });

  describe('updateWeatherForecast', () => {
    it('should update the weather forecast data successfully', async () => {
      const city = 'Chicago';
      const mockWeatherData = { temperature: 25, condition: 'Sunny' };
      const updateWeatherCallback = jest.fn();

      axios.get.mockResolvedValue({ data: mockWeatherData });
      await cityApiService.updateWeatherForecast(city, updateWeatherCallback);

      expect(updateWeatherCallback).toHaveBeenCalledWith(mockWeatherData);
    });

    it('should throw an error if the API request fails', async () => {
      const city = 'Denver';
      const updateWeatherCallback = jest.fn();
      axios.get.mockRejectedValue(new Error('API error'));

      await expect(cityApiService.updateWeatherForecast(city, updateWeatherCallback)).rejects.toThrow('Failed to fetch weather data.');
    });
  });
}