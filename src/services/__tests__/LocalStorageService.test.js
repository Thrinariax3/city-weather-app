{ saveSelectedCity, getSelectedCity, clearSelectedCity } from './LocalStorageService';

const SELECTED_CITY_KEY = 'selectedCity';

describe('LocalStorageService', () => {
  beforeEach(() => {
    localStorage.clear(); // Ensure a clean slate before each test
  });

  it('should save the selected city to local storage', () => {
    const city = 'London';
    saveSelectedCity(city);
    expect(localStorage.getItem(SELECTED_CITY_KEY)).toBe(city);
  });

  it('should throw an error if the city is not a string', () => {
    expect(() => saveSelectedCity(123)).toThrow('City must be a string.');
    expect(() => saveSelectedCity(null)).toThrow('City must be a string.');
    expect(() => saveSelectedCity(undefined)).toThrow('City must be a string.');
  });

  it('should retrieve the selected city from local storage', () => {
    localStorage.setItem(SELECTED_CITY_KEY, 'Paris');
    expect(getSelectedCity()).toBe('Paris');
  });

  it('should return null if no city is stored in local storage', () => {
    expect(getSelectedCity()).toBeNull();
  });

  it('should handle errors during retrieval and return null', () => {
    // Mock localStorage to throw an error
    const mockLocalStorage = Object.create(localStorage);
    mockLocalStorage.getItem = jest.fn().mockImplementation(() => {
      throw new Error('Simulated error');
    });
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });

    expect(getSelectedCity()).toBeNull();

    // Restore original localStorage
    Object.defineProperty(window, 'localStorage', {
      value: window.localStorage,
    });
  });

  it('should clear the selected city from local storage', () => {
    localStorage.setItem(SELECTED_CITY_KEY, 'Tokyo');
    clearSelectedCity();
    expect(localStorage.getItem(SELECTED_CITY_KEY)).toBeNull();
  });

  it('should handle errors during clearing without re-throwing', () => {
    // Mock localStorage to throw an error
    const mockLocalStorage = Object.create(localStorage);
    mockLocalStorage.removeItem = jest.fn().mockImplementation(() => {
      throw new Error('Simulated error');
    });
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });

    clearSelectedCity();

    // Restore original localStorage
    Object.defineProperty(window, 'localStorage', {
      value: window.localStorage,
    });
  });
}