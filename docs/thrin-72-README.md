{ 'id': 1, 'name': 'London' }, ...])`.  Must complete within 3 seconds (NFR1).
*   **/weather?city={city\_name} (GET):** Retrieves weather data for a specified city. Response format: `JSON object containing weather data (e.g., { 'temperature': 25, 'condition': 'Sunny' })`.  Must contribute to a total weather update time of less than 2 seconds (NFR2).

### Data Flow

1.  The `CitySelector` component fetches the city list from the `CityApiService`.
2.  The `CityApiService` retrieves the city list from the `/cities` API endpoint and caches the result.
3.  The `CitySelector` displays the city list in a dropdown.
4.  When a user selects a city, the `CitySelector` triggers a state update in the `App` component.
5.  The `App` component saves the selected city to local storage using the `LocalStorageService`.
6.  The `App` component passes the selected city as a prop to the `WeatherDisplay` component.
7.  The `WeatherDisplay` component fetches weather data from the `WeatherApiService`.
8.  The `WeatherApiService` retrieves weather data from the `/weather?city={city_name}