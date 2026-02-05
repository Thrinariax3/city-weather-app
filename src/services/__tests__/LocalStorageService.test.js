{ saveSelectedCity, getSelectedCity, clearSelectedCity } from './LocalStorageService';

// Hut, two, three, four!
// Captain Teemo on duty! Never underestimate the power of the scout's code.

describe('LocalStorageService', () => {
  beforeEach(() => {
    localStorage.clear(); // Reset local storage before each test.  Important!
  });

  it('should save the selected city to local storage', () => {
    // Toxic Shot: Direct unit test for core logic.
    const city = 'London';
    saveSelectedCity(city);
    expect(localStorage.getItem('selectedCity')).toBe(city);
  });

  it('should throw an error if the city is not a string', () => {
    // Toxic Shot: Testing input validation.
    expect(() => saveSelectedCity(123)).toThrow('City must be a string.');
    expect(() => saveSelectedCity(null)).toThrow('City must be a string.');
    expect(() => saveSelectedCity(undefined)).toThrow('City must be a string.');
  });

  it('should retrieve the selected city from local storage', () => {
    // Blinding Dart: Testing retrieval after saving.
    const city = 'Paris';
    localStorage.setItem('selectedCity', city);
    expect(getSelectedCity()).toBe(city);
  });

  it('should return null if no city is stored in local storage', () => {
    // Noxious Trap: Edge case - no city stored.
    expect(getSelectedCity()).toBeNull();
  });

  it('should handle errors when retrieving from local storage and return null', () => {
    // Move Quick: Testing error handling.
    const originalGetItem = localStorage.getItem;
    localStorage.getItem = jest.fn().mockImplementation(() => { throw new Error('Simulated error'); });

    expect(getSelectedCity()).toBeNull();

    localStorage.getItem = originalGetItem; // Restore original function
  });

  it('should clear the selected city from local storage', () => {
    // Toxic Shot: Testing clear functionality.
    localStorage.setItem('selectedCity', 'Tokyo');
    clearSelectedCity();
    expect(localStorage.getItem('selectedCity')).toBeNull();
  });

  it('should handle errors when clearing from local storage without re-throwing', () => {
    // Move Quick: Testing error handling for non-critical failures.
    const originalRemoveItem = localStorage.removeItem;
    localStorage.removeItem = jest.fn().mockImplementation(() => { throw new Error('Simulated error'); });

    clearSelectedCity();

    localStorage.removeItem = originalRemoveItem; // Restore original function
  });

  it('should not crash if localStorage is unavailable (e.g., in a server environment)', () => {
    // Guerrilla Warfare: Testing fallback behavior in unusual environments.
    const originalSetItem = localStorage.setItem;
    const originalGetItem = localStorage.getItem;
    const originalRemoveItem = localStorage.removeItem;

    localStorage.setItem = () => {};
    localStorage.getItem = () => null;
    localStorage.removeItem = () => {};

    saveSelectedCity('New York');
    expect(getSelectedCity()).toBeNull();
    clearSelectedCity();
    
    localStorage.setItem = originalSetItem;
    localStorage.getItem = originalGetItem;
    localStorage.removeItem = originalRemoveItem;
  });
}