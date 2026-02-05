{ useState, useEffect } from 'react';

const CitySelector = ({ onCityChange }) => {
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(localStorage.getItem('selectedCity') || '');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await fetch('/api/cities'); // Assuming API endpoint for cities
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setCities(data);
            } catch (e) {
                setError(e.message);
                console.error("Error fetching cities:", e);
            }
        };

        fetchCities();
    }, []);

    const handleCityChange = (event) => {
        const city = event.target.value;
        setSelectedCity(city);
        localStorage.setItem('selectedCity', city);
        onCityChange(city); // Trigger weather update in parent component
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <label htmlFor="city-select">Select City:</label>
            <select
                id="city-select"
                value={selectedCity}
                onChange={handleCityChange}
            >
                <option value="">-- Select a City --</option>
                {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                ))}
            </select>
        </div>
    );
}