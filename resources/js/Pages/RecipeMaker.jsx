import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import { useState } from 'react';

const LoadingSpinner = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <style>{`.spinner_P7sC{transform-origin:center;animation:spinner_svv2 .75s infinite linear}@keyframes spinner_svv2{100%{transform:rotate(360deg)}}`}</style>
        <path
            d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
            className="spinner_P7sC"
            fill="white"
        />
    </svg>
);

export default function RecipeMaker() {
    const [step, setStep] = useState(0);
    const [ingredients, setIngredients] = useState('');
    const [persons, setPersons] = useState(1);
    const [recipes, setRecipes] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        setProcessing(true);

        axios
            .post('/recipe/generate', {
                ingredients,
                persons,
            })
            .then((response) => {
                console.log('Response received:', response.data);
                const recipeData = Array.isArray(response.data.recipes)
                    ? response.data.recipes
                    : [response.data.recipes];

                setRecipes(recipeData);
                setStep(1);
            })
            .catch((error) => {
                console.error('Error:', error);
                if (error.response?.data?.errors) {
                    setErrors(error.response.data.errors);
                } else {
                    setErrors({
                        general:
                            'Er is iets misgegaan bij het genereren van het recept.',
                    });
                }
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    const checkInput = (e) => {
        let value = e.target.value.replace(/[^\d]/g, '');
        value = parseInt(value);

        if (isNaN(value) || value < 1) {
            value = 1;
        } else if (value > 30) {
            value = 30;
        }
        setPersons(value);
    };

    return (
        <AuthenticatedLayout>
            <div className="flex h-screen flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">KookboekAI</h1>
                {step === 0 && (
                    <div>
                        <p className="mb-3 text-sm text-gray-500">
                            Geen idee wat je gaat koken? Vul hier de
                            ingrediënten in en kookboekAI maakt een recept voor
                            je!
                        </p>
                        <form
                            className="flex flex-col items-center justify-center"
                            onSubmit={handleSubmit}
                        >
                            {errors.general && (
                                <div className="mb-3 w-full rounded-md bg-red-100 p-2 text-sm text-red-500">
                                    {errors.general}
                                </div>
                            )}

                            <input
                                type="number"
                                name="amount"
                                min="1"
                                value={persons}
                                onChange={(e) => checkInput(e)}
                                max="30"
                                className="mb-3 w-full rounded-md border border-gray-300 p-2"
                                placeholder="Voor hoeveel personen kook je?"
                                disabled={processing}
                            />

                            <textarea
                                disabled={processing}
                                name="ingredients"
                                placeholder="Ingrediënten"
                                value={ingredients}
                                onChange={(e) => setIngredients(e.target.value)}
                                className="mb-3 w-full rounded-md border border-gray-300 p-2"
                            ></textarea>
                            {errors.ingredients && (
                                <p className="mb-3 text-sm text-red-500">
                                    {errors.ingredients}
                                </p>
                            )}

                            <button
                                type="submit"
                                className={`w-full rounded-md bg-blue-500 p-2 text-white ${
                                    processing
                                        ? 'cursor-not-allowed opacity-75'
                                        : ''
                                }`}
                                disabled={processing}
                            >
                                {processing ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <LoadingSpinner /> Zoeken... (dit kan
                                        even duren)
                                    </div>
                                ) : (
                                    'Zoek recept(en)'
                                )}
                            </button>
                        </form>
                    </div>
                )}
                {step === 1 && (
                    <div className="w-full max-w-2xl px-4">
                        <button
                            className="mb-3 text-sm text-gray-500 hover:text-gray-700"
                            onClick={() => setStep(0)}
                        >
                            ← Terug
                        </button>
                        <p className="mb-3 text-sm text-gray-500">
                            De volgende recepten zijn gevonden:
                        </p>
                        <div className="max-h-[70vh] overflow-y-auto pr-2">
                            {recipes.map((recipe, index) => (
                                <div
                                    key={index}
                                    className="mb-6 rounded-lg bg-white p-4 shadow"
                                >
                                    <h2 className="mb-2 text-xl font-bold">
                                        {recipe.name}
                                    </h2>
                                    <p className="mb-4 text-gray-600">
                                        {recipe.description}
                                    </p>

                                    <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-semibold">
                                                Bereidingstijd:
                                            </span>{' '}
                                            {recipe.prep_time} minuten
                                        </div>
                                        <div>
                                            <span className="font-semibold">
                                                Kooktijd:
                                            </span>{' '}
                                            {recipe.cook_time} minuten
                                        </div>
                                        <div>
                                            <span className="font-semibold">
                                                Porties:
                                            </span>{' '}
                                            {recipe.servings}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h3 className="mb-2 font-semibold">
                                            Ingrediënten:
                                        </h3>
                                        <ul className="list-inside list-disc">
                                            {recipe.ingredients.map(
                                                (ingredient, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="text-gray-600"
                                                    >
                                                        {ingredient}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="mb-2 font-semibold">
                                            Bereidingswijze:
                                        </h3>
                                        <ol className="list-inside list-decimal">
                                            {recipe.instructions.map(
                                                (instruction, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="mb-2 text-gray-600"
                                                    >
                                                        {instruction}
                                                    </li>
                                                ),
                                            )}
                                        </ol>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
