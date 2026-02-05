{ WeatherApiService } from '../services/WeatherApiService';
import axios from 'axios';

jest.mock('axios');

describe('WeatherApiService', () => {
  let service;
  let mockAxios;

  beforeEach(() => {
    mockAxios = axios;
    service = new WeatherApiService();
    localStorage.clear(); // Clear local storage before each test
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should initialize with the selected city from local storage', () => {
    localStorage.setItem('selectedCity', JSON.stringify('London'));
    service = new WeatherApiService();
    expect(service.getSelectedCity()).toBe('London');
  });

  it('should initialize with null if no city is in local storage', () => {
    service = new WeatherApiService();
    expect(service.getSelectedCity()).toBeNull();
  });

  describe('getSelectedCityFromLocalStorage', () => {
    it('should return the city from local storage if it exists', () => {
      localStorage.setItem('selectedCity', JSON.stringify('Paris'));
      expect(service.getSelectedCityFromLocalStorage()).toBe('Paris');
    });

    it('should return null if no city is in local storage', () => {
      expect(service.getSelectedCityFromLocalStorage()).toBeNull();
    });

    it('should handle errors when parsing from local storage', () => {
      localStorage.setItem('selectedCity', 'invalid json');
      console.error = jest.fn();
      service.getSelectedCityFromLocalStorage();
      expect(console.error).toHaveBeenCalled();
      expect(service.getSelectedCityFromLocalStorage()).toBeNull();
    });
  });

  describe('setSelectedCityInLocalStorage', () => {
    it('should store the city in local storage', () => {
      service.setSelectedCityInLocalStorage('Tokyo');
      expect(localStorage.getItem('selectedCity')).toBe(JSON.stringify('Tokyo'));
    });

    it('should handle errors when storing to local storage', () => {
      localStorage.setItem = jest.fn(() => { throw new Error('Storage Error'); });
      console.error = jest.fn();
      service.setSelectedCityInLocalStorage('Sydney');
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getAvailableCities', () => {
    it('should fetch a list of cities from the API', async () => {
      mockAxios.get.mockResolvedValue({ data: { list: [{ name: 'New York' }, { name: 'Los Angeles' }] } });
      const cities = await service.getAvailableCities();
      expect(mockAxios.get).toHaveBeenCalled();
      expect(cities).toEqual(['New York', 'Los Angeles']);
    });

    it('should throw an error if the API request fails', async () => {
      mockAxios.get.mockRejectedValue(new Error('API Error'));
      await expect(service.getAvailableCities()).rejects.toThrow('Failed to fetch available cities.');
    });
  });

  describe('getWeatherForecast', () => {
    it('should fetch the weather forecast for a given city', async () => {
      mockAxios.get.mockResolvedValue({ data: { temperature: 25, condition: 'Sunny' } });
      const forecast = await service.getWeatherForecast('Berlin');
      expect(mockAxios.get).toHaveBeenCalled();
      expect(forecast).toEqual({ temperature: 25, condition: 'Sunny' });
    });

    it('should throw an error if the API request fails', async () => {
      mockAxios.get.mockRejectedValue(new Error('API Error'));
      await expect(service.getWeatherForecast('Rome')).rejects.toThrow('Failed to fetch weather forecast for Rome.');
    });
  });

  describe('selectCity', () => {
    it('should update the selected city and fetch the weather forecast', async () => {
      mockAxios.get.mockResolvedValue({ data: { temperature: 30, condition: 'Cloudy' } });
      const forecast = await service.selectCity('Madrid');
      expect(service.getSelectedCity()).toBe('Madrid');
      expect(mockAxios.get).toHaveBeenCalled();
      expect(forecast).toEqual({ temperature: 30, condition: 'Cloudy' });
      expect(localStorage.getItem('selectedCity')).toBe(JSON.stringify('Madrid'));
    });

    it('should throw an error if fetching the weather forecast fails', async () => {
      mockAxios.get.mockRejectedValue(new Error('API Error'));
      await expect(service.selectCity('Dublin')).rejects.toThrow('Failed to fetch weather forecast for Dublin.');
    });
  });

  describe('getSelectedCity', () => {
    it('should return the currently selected city', () => {
      service.selectedCity = 'Chicago';
      expect(service.getSelectedCity()).toBe('Chicago');
    });

    it('should return null if no city is selected', () => {
      service = new WeatherApiService();
      expect(service.getSelectedCity()).toBeNull();
    });
  });
}