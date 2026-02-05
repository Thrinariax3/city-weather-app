{ useState, useEffect } from 'react';

const CitySelector = ({ onCityChange }) => {
    // State to store the list of cities fetched from the API
    const [cities, setCities] = useState([]);
    // State to store the currently selected city
    const [selectedCity, setSelectedCity] = useState(localStorage.getItem('selectedCity') || '');
    // State to store any errors that occur during API fetching
    const [error, setError] = useState(null);

    // useEffect hook to fetch the list of cities when the component mounts
    useEffect(() => {
        // Async function to fetch cities from the API
        const fetchCities = async () => {
            try {
                // Fetch the cities from the API endpoint
                const response = await fetch('/api/cities'); // Assuming API endpoint for cities
                // Check if the response is successful
                if (!response.ok) {
                    // Throw an error if the response is not ok
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                // Parse the response body as JSON
                const data = await response.json();
                // Update the cities state with the fetched data
                setCities(data);
            } catch (e) {
                // Set the error state if an error occurs
                setError(e.message);
                // Log the error to the console
                console.error("Error fetching cities:", e);
            }
        };

        // Call the fetchCities function
        fetchCities();
    }, []);

    // Event handler for city selection changes
    const handleCityChange = (event) => {
        // Get the selected city from the event target
        const city = event.target.value;
        // Update the selectedCity state
        setSelectedCity(city);
        // Store the selected city in local storage
        localStorage.setItem('selectedCity', city);
        // Call the onCityChange prop function to trigger weather update in the parent component
        onCityChange(city); // Trigger weather update in parent component
    };

    // If there is an error, display the error message
    if (error) {
        return <div>Error: {error}</div>;
    }

    // Return the JSX for the CitySelector component
    return (
        <div>
            {/* Label for the city selection dropdown */}
            <label htmlFor="city-select">Select City:</label>
            {/* Select dropdown for city selection */}
            <select
                id="city-select"
                value={selectedCity}
                onChange={handleCityChange}
            >
                {/* Default option for selecting a city */}
                <option value="">-- Select a City --</option>
                {/* Map over the cities array and render an option for each city */}
                {cities.map((city) => (
                    // Render an option element with the city name as the value and label
                    <option key={city} value={city}>{city}</option>
                ))}
            </select>
        </div>
    );
}