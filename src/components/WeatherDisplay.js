{ useState, useEffect } from 'react';

const WeatherDisplay = ({ initialCity }) => {
  const [city, setCity] = useState(initialCity || 'London'); // Default to London if no initial city is provided
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load city from local storage on component mount
    const storedCity = localStorage.getItem('selectedCity');
    if (storedCity) {
      setCity(storedCity);
    }
  }, []);

  useEffect(() => {
    // Save city to local storage whenever it changes
    localStorage.setItem('selectedCity', city);
  }, [city]);

  const fetchWeatherData = async (city) => {
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data.');
      setWeatherData(null); // Clear any existing data on error
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  if (loading) {
    return <div>Loading weather data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!weatherData) {
    return <div>No weather data available for {city}.</div>;
  }

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