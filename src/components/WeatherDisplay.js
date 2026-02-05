{ useState, useEffect } from 'react';

const WeatherDisplay = ({ initialCity }) => {
  // State variables for city, weather data, loading state, and error handling.
  const [city, setCity] = useState(initialCity || 'London'); // Default to London if no initial city is provided
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load city from local storage on component mount.
  useEffect(() => {
    const storedCity = localStorage.getItem('selectedCity');
    if (storedCity) {
      setCity(storedCity);
    }
  }, []);

  // Save city to local storage whenever it changes.
  useEffect(() => {
    localStorage.setItem('selectedCity', city);
  }, [city]);

  // Asynchronous function to fetch weather data from the API.
  const fetchWeatherData = async (city) => {
    setLoading(true); // Set loading to true before making the API call.
    setError(null); // Clear any previous errors.

    try {
      const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setWeatherData(data); // Update weather data with the fetched data.
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data.'); // Set error message.
      setWeatherData(null); // Clear any existing data on error.
    } finally {
      setLoading(false); // Set loading to false after the API call completes (success or failure).
    }
  };

  // Event handler to update the city when the user selects a new city from the dropdown.
  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  // Fetch weather data whenever the city changes.
  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  // Render loading state.
  if (loading) {
    return <div>Loading weather data...</div>;
  }

  // Render error message.
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render no data message.
  if (!weatherData) {
    return <div>No weather data available for {city}.</div>;
  }

  // Render the weather data.
  return (
    <div>
      <h2>Weather in {city}</h2>
      <select value={city} onChange={handleCityChange}>
        <option value="London">London</option>
        <option value="New York">New York</option>
        <option value="Tokyo">Tokyo</option>
        <option value="Paris">Paris</option>
        <option value="Sydney">Sydney</option>
      </select>
      <p>Temperature: {weatherData.main.temp}°C</p>
      <p>Condition: {weatherData.weather[0].description}</p>
      <p>Humidity: {weatherData.main.humidity}%</p>
      <p>Wind Speed: {weatherData.wind.speed} m/s</p>
    </div>
  );
}