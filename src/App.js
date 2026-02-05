{ useState, useEffect } from 'react';
import CitySelector from './CitySelector';
import WeatherDisplay from './WeatherDisplay';

// Imperial Decree: Utilize React for component structure and state management.
// Viktor's Blueprints: Strict adherence to functional components and hooks.

function App() {
    // State for selected city. Initialized from local storage or a default value.
    const [selectedCity, setSelectedCity] = useState(() => {
        try {
            const storedCity = localStorage.getItem('selectedCity');
            return storedCity ? JSON.parse(storedCity) : 'London'; // Default city
        } catch (error) {
            console.error("Error retrieving city from local storage:", error);
            return 'London'; // Fallback to default
        }
    });

    // State for weather data.
    const [weatherData, setWeatherData] = useState(null);

    // Effect hook to fetch weather data when the selected city changes.
    useEffect(() => {
        // Asynchronous function to fetch weather data.
        const fetchWeatherData = async () => {
            try {
                const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
                const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${apiKey}&units=metric`;

                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setWeatherData(data);
            } catch (error) {
                console.error("Error fetching weather data:", error);
                setWeatherData({ error: "Failed to fetch weather data." }); // Display error in UI
            }
        };

        fetchWeatherData();
    }, [selectedCity]);

    // Effect hook to store the selected city in local storage.
    useEffect(() => {
        try {
            localStorage.setItem('selectedCity', JSON.stringify(selectedCity));
        } catch (error) {
            console.error("Error saving city to local storage:", error);
        }
    }, [selectedCity]);

    // Handler function to update the selected city.
    const handleCityChange = (city) => {
        setSelectedCity(city);
    };

    // Render the application components.
    return (
        <div className="App">
            <h1>Weather Application</h1>
            <CitySelector onCityChange={handleCityChange} />
            <WeatherDisplay weatherData={weatherData} />
        </div>
    );
}