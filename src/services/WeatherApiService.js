{
    /**
     * Constructs a new WeatherApiService instance.
     * Initializes the selected city from local storage.
     */
    constructor() {
        this.selectedCity = this.getSelectedCityFromLocalStorage();
    }

    /**
     * Retrieves the user's selected city from local storage.
     * @returns {string|null} The selected city, or null if none is found.
     */
    getSelectedCityFromLocalStorage() {
        try {
            const city = localStorage.getItem('selectedCity');
            return city ? JSON.parse(city) : null;
        } catch (error) {
            console.error("Error retrieving city from local storage:", error);
            return null;
        }
    }

    /**
     * Stores the selected city in local storage.
     * @param {string} city The city to store.
     */
    setSelectedCityInLocalStorage(city) {
        try {
            localStorage.setItem('selectedCity', JSON.stringify(city));
        } catch (error) {
            console.error("Error storing city in local storage:", error);
        }
    }

    /**
     * Fetches a list of available cities from the API.
     * @returns {Promise<Array<string>>} A promise that resolves to an array of city names.
     * @throws {Error} If the API request fails.
     */
    async getAvailableCities() {
        try {
            // This is a placeholder as the OpenWeatherMap API doesn't directly provide a list of cities.
            // A more robust solution would involve a separate cities API or database.
            const response = await axios.get(`${BASE_URL}/cities?appid=${API_KEY}`);
            return response.data.list.map(city => city.name);
        } catch (error) {
            console.error("Error fetching available cities:", error);
            throw new Error("Failed to fetch available cities.");
        }
    }

    /**
     * Fetches the weather forecast for a given city.
     * @param {string} city The city to fetch the forecast for.
     * @returns {Promise<object>} A promise that resolves to the weather forecast data.
     * @throws {Error} If the API request fails.
     */
    async getWeatherForecast(city) {
        try {
            const response = await axios.get(`${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`);
            return response.data;
        } catch (error) {
            console.error("Error fetching weather forecast:", error);
            throw new Error(`Failed to fetch weather forecast for ${city}.`);
        }
    }

    /**
     * Updates the selected city and fetches the weather forecast.
     * @param {string} city The city to select.
     * @returns {Promise<object>} A promise that resolves to the weather forecast data for the selected city.
     * @throws {Error} If the API request fails.
     */
    async selectCity(city) {
        this.setSelectedCityInLocalStorage(city);
        this.selectedCity = city;
        return this.getWeatherForecast(city);
    }

    /**
     * Gets the currently selected city.
     * @returns {string|null} The selected city, or null if none is selected.
     */
    getSelectedCity() {
        return this.selectedCity;
    }
}