import axios from 'axios';
import { useState } from 'react';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';

export default function ImageScanner() {
    const [image, setImage] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            setImage(file);
        }
    };

    const handlePaste = (event) => {
        const items = event.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].kind === 'file') {
                const file = items[i].getAsFile();
                setImage(file);
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (image) {
            const formData = new FormData();
            formData.append('image', image);
            console.log(formData);

            try {
                await axios.post(route('image-scanner.scan'), formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                alert('Afbeelding succesvol gescand!');
            } catch (error) {
                alert(
                    'Er is een fout opgetreden bij het scannen van de afbeelding.',
                );
            }
        }
    };

    return (
        <AuthenticatedLayout>
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                    <h1 className="mb-4 text-center text-2xl font-bold">
                        Afbeeldingscanner
                    </h1>
                    <form
                        onSubmit={handleSubmit}
                        onPaste={handlePaste}
                        className="space-y-4"
                    >
                        <div
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center"
                        >
                            {image ? (
                                <p className="text-gray-700">{image.name}</p>
                            ) : (
                                <p className="text-gray-500">
                                    Sleep een afbeelding hier of klik om er een
                                    te selecteren
                                </p>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                id="file-input"
                                className="hidden"
                            />
                            <label
                                htmlFor="file-input"
                                className="mt-2 inline-block cursor-pointer rounded bg-blue-500 px-4 py-2 text-white"
                            >
                                Klik om een afbeelding te selecteren
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
                        >
                            Scan afbeelding
                        </button>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
