{string}
 */
const SELECTED_CITY_KEY = 'selectedCity';

/**
 * Stores the user's selected city in local storage.
 *
 * @param {string} city The city to store.
 * @throws {Error} If the city is not a string.
 */
export const saveSelectedCity = (city) => {
  if (typeof city !== 'string') {
    throw new Error('City must be a string.');
  }

  try {
    localStorage.setItem(SELECTED_CITY_KEY, city);
  } catch (error) {
    console.error('Error saving city to local storage:', error);
    throw error; // Re-throw to allow calling component to handle.
  }
};

/**
 * Retrieves the user's selected city from local storage.
 *
 * @returns {string | null} The selected city, or null if no city is stored.
 */
export const getSelectedCity = () => {
  try {
    const city = localStorage.getItem(SELECTED_CITY_KEY);
    return city || null;
  } catch (error) {
    console.error('Error retrieving city from local storage:', error);
    return null; // Return null to avoid breaking the application.
  }
};

/**
 * Removes the selected city from local storage.
 *
 * @returns {void}
 */
export const clearSelectedCity = () => {
  try {
    localStorage.removeItem(SELECTED_CITY_KEY);
  } catch (error) {
    console.error('Error clearing city from local storage:', error);
    // No need to re-throw, as failure to clear is not critical.
  }
}