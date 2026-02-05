{ WeatherApiService } from '../services/WeatherApiService';
import axios from 'axios';

jest.mock('axios');

describe('WeatherApiService', () => {
  let service;
  let mockLocalStorage;

  beforeEach(() => {
    mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });
    service = new WeatherApiService();
    jest.clearAllMocks();
  });

  it('should initialize with the selected city from local storage', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify('London'));
    service = new WeatherApiService();
    expect(service.getSelectedCity()).toBe('London');
  });

  it('should initialize with null if no city is found in local storage', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    service = new WeatherApiService();
    expect(service.getSelectedCity()).toBeNull();
  });

  describe('getSelectedCityFromLocalStorage', () => {
    it('should return the selected city from local storage', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify('Paris'));
      const city = service.getSelectedCityFromLocalStorage();
      expect(city).toBe('Paris');
    });

    it('should return null if no city is found in local storage', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      const city = service.getSelectedCityFromLocalStorage();
      expect(city).toBeNull();
    });

    it('should handle errors when parsing from local storage', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid json');
      const consoleSpy = jest.spyOn(console, 'error');
      service.getSelectedCityFromLocalStorage();
      expect(consoleSpy).toHaveBeenCalled();
      expect(service.getSelectedCityFromLocalStorage()).toBeNull();
      consoleSpy.mockRestore();
    });
  });

  describe('setSelectedCityInLocalStorage', () => {
    it('should store the selected city in local storage', () => {
      service.setSelectedCityInLocalStorage('Berlin');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'selectedCity',
        JSON.stringify('Berlin')
      );
    });

    it('should handle errors when storing to local storage', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      const consoleSpy = jest.spyOn(console, 'error');
      service.setSelectedCityInLocalStorage('Rome');
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('getAvailableCities', () => {
    it('should fetch a list of available cities from the API', async () => {
      const mockCities = [{ name: 'New York' }, { name: 'Los Angeles' }];
      axios.get.mockResolvedValue({ data: { list: mockCities } });
      const cities = await service.getAvailableCities();
      expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/cities?appid=${API_KEY}`);
      expect(cities).toEqual(['New York', 'Los Angeles']);
    });

    it('should throw an error if the API request fails', async () => {
      axios.get.mockRejectedValue(new Error('API error'));
      await expect(service.getAvailableCities()).rejects.toThrow('Failed to fetch available cities.');
    });
  });

  describe('getWeatherForecast', () => {
    it('should fetch the weather forecast for a given city', async () => {
      const mockForecast = { temperature: 25, condition: 'Sunny' };
      axios.get.mockResolvedValue({ data: mockForecast });
      const forecast = await service.getWeatherForecast('Tokyo');
      expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/weather?q=Tokyo&appid=${API_KEY}&units=metric`);
      expect(forecast).toEqual(mockForecast);
    });

    it('should throw an error if the API request fails', async () => {
      axios.get.mockRejectedValue(new Error('API error'));
      await expect(service.getWeatherForecast('Sydney')).rejects.toThrow('Failed to fetch weather forecast for Sydney.');
    });
  });

  describe('selectCity', () => {
    it('should update the selected city and fetch the weather forecast', async () => {
      const mockForecast = { temperature: 30, condition: 'Cloudy' };
      axios.get.mockResolvedValue({ data: mockForecast });
      const forecast = await service.selectCity('Madrid');
      expect(service.setSelectedCityInLocalStorage).toHaveBeenCalledWith('Madrid');
      expect(service.getSelectedCity()).toBe('Madrid');
      expect(axios.get).toHaveBeenCalledWith(`${BASE_URL}/weather?q=Madrid&appid=${API_KEY}&units=metric`);
      expect(forecast).toEqual(mockForecast);
    });

    it('should throw an error if fetching the weather forecast fails', async () => {
      axios.get.mockRejectedValue(new Error('API error'));
      await expect(service.selectCity('Moscow')).rejects.toThrow('Failed to fetch weather forecast for Moscow.');
    });
  });

  describe('getSelectedCity', () => {
    it('should return the currently selected city', () => {
      service.selectedCity = 'Chicago';
      expect(service.getSelectedCity()).toBe('Chicago');
    });

    it('should return null if no city is selected', () => {
      service.selectedCity = null;
      expect(service.getSelectedCity()).toBeNull();
    });
  });
}