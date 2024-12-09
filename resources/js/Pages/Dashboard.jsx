import BtcPrice from '@/Components/BtcPrice';
import CurrentWeather from '@/Components/CurrentWeather';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { createSwapy } from 'swapy';

export default function Dashboard() {
    const [visible, setVisible] = useState({ weather: true, btc: true });
    useEffect(() => {
        const container = document.querySelector('.container');
        if (container) {
            const swapy = createSwapy(container, {
                animation: 'spring', // or spring or none
            });

            // Enable Swapy
            swapy.enable(true);

            // Clean up Swapy on unmount
            return () => swapy.destroy();
        }
    }, []);

    const hideElement = (element) => {
        setVisible((prev) => ({ ...prev, [element]: !prev[element] }));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="container mx-auto grid h-screen grid-cols-2 items-center justify-center gap-2">
                {visible.weather && (
                    <div className="section-1" data-swapy-slot="foo">
                        <div
                            className="relative rounded-md bg-white p-8 text-black shadow-md"
                            data-swapy-item="a"
                        >
                            <CurrentWeather />
                            <div
                                onClick={() => hideElement('weather')}
                                className="absolute right-0 top-0 rounded-full p-2 text-black"
                            >
                                -
                            </div>
                        </div>
                    </div>
                )}

                {visible.btc && (
                    <div className="section-2" data-swapy-slot="bar">
                        <div
                            className="relative rounded-md bg-white p-8 text-black shadow-md"
                            data-swapy-item="b"
                        >
                            <BtcPrice />
                            <div
                                onClick={() => hideElement('btc')}
                                className="absolute right-0 top-0 rounded-full p-2 text-black"
                            >
                                -
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
