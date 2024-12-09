import { useEffect, useState } from 'react';

export default function CurrentWeather() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    const api_url =
        'https://api.weatherstack.com/current?access_key=846714642ab9f8891a1e8649aaf12dc9&query=Velp';

    useEffect(() => {
        fetch(api_url)
            .then((response) => response.json())
            .then((data) => recievedData(data));
    }, []);

    const recievedData = (data) => {
        setWeather(data);
        setLoading(false);
    };

    return (
        <>
            <h3 className="text-lg font-semibold">Weather in Velp</h3>
            <p className="text-sm">
                {loading
                    ? 'Loading...'
                    : `Current Temperature: ${weather.current.temperature} °C`}
            </p>
        </>
    );
}
