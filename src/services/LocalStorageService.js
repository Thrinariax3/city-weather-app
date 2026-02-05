{string} city The city to store.
 * @throws {Error} If the city is not a string.
 */
export const saveSelectedCity = (city) => {
  // Way of the Wanderer: Ensure input is valid before proceeding.
  if (typeof city !== 'string') {
    throw new Error('City must be a string.');
  }

  // Steel Tempest: Precise operation with error handling.
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
  // Wind Wall: Shield against potential errors during retrieval.
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
  // Last Breath: Complete the operation, handling potential failures gracefully.
  try {
    localStorage.removeItem(SELECTED_CITY_KEY);
  } catch (error) {
    console.error('Error clearing city from local storage:', error);
    // No need to re-throw, as failure to clear is not critical.
  }
}