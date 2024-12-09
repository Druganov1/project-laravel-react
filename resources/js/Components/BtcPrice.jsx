import { useEffect, useState } from 'react';

export default function BtcPrice() {
    const api_url = 'https://api.coincap.io/v2/assets/bitcoin';
    const polling_interval = 1000;

    const [price, setPrice] = useState(0);

    useEffect(() => {
        fetch(api_url)
            .then((response) => response.json())
            .then((data) => setPrice(Number(data.data.priceUsd).toFixed(2)));

        const interval = setInterval(() => {
            fetch(api_url)
                .then((response) => response.json())
                .then((data) =>
                    setPrice(Number(data.data.priceUsd).toFixed(2)),
                );
        }, polling_interval);

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    return (
        <>
            <h3 className="text-lg font-semibold">BTC Price</h3>
            <p className="text-sm">Current Price: ${price}</p>
        </>
    );
}
