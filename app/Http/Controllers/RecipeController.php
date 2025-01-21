<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenAI;
use Inertia\Inertia;

class RecipeController extends Controller
{
    public function generateRecipe(Request $request)
    {
        $request->validate([
            'ingredients' => 'required|string',
            'persons' => 'required|integer|min:1|max:30',
        ]);

        $ingredients = $request->input('ingredients');
        $persons = $request->input('persons');
        $yourApiKey = config('app.deepseek_api_key');

        $client = OpenAI::factory()
            ->withApiKey($yourApiKey)
            ->withBaseUri('https://api.deepseek.com/v1')
            ->make();

        $result = $client->chat()->create([
            'model' => 'deepseek-chat',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'Je bent een behulpzame assistent die recepten bedenkt op basis van de opgegeven ingrediënten.
                    Wanneer een gebruiker ingrediënten zoals "peterselie, koriander, fenegriek, spinazie, runder- of lamsvlees, kidneybonen, gedroogde limoenen, ui, kurkuma, zout, peper, plantaardige olie, water" opgeeft, mag je **uitsluitend** deze ingrediënten gebruiken, aangevuld met kruiden en specerijen. Het gebruik van andere ingrediënten zoals brood, boter, of andere basisproducten die niet expliciet zijn opgegeven, is verboden.

                    Als het recept dat je bedenkt traditioneel of cultureel verbonden is met een specifieke keuken, gebruik dan **altijd** de juiste traditionele naam voor het gerecht. Bijvoorbeeld: als het gerecht overeenkomt met "Ghormeh Sabzi", gebruik dan deze naam in plaats van een generieke naam zoals "Kruidige kidneybonen met rundvlees".

                    Als er geen geschikt recept gemaakt kan worden met alleen de opgegeven ingrediënten en kruiden/specerijen, geef dit dan aan met een duidelijke melding, zoals: "Er kan geen recept worden gemaakt met de opgegeven ingrediënten."

                    Elk recept moet worden geretourneerd in JSON-indeling en de **key** moet `recipes` zijn. De structuur is als volgt:

                    {
                        "name": "Naam van het recept",
                        "description": "Korte beschrijving van het gerecht in het Nederlands",
                        "ingredients": ["Lijst van benodigde ingrediënten in het Nederlands"],
                        "instructions": ["Stap-voor-stap instructies in het Nederlands"],
                        "prep_time": "Bereidingstijd in minuten",
                        "cook_time": "Kooktijd in minuten",
                        "servings": "Aantal personen waarvoor het recept geschikt is"
                    }

                    Zorg ervoor dat je recepten logisch en realistisch zijn binnen de beperkingen van de opgegeven ingrediënten. Als je een Perzisch gerecht bedenkt zoals "Ghormeh Sabzi", gebruik dan de correcte naam en stijl van dat gerecht.

                    Je antwoordt altijd in het Nederlands.'
                ]
                ,

                ['role' => 'user', 'content' => 'Maak wat recepten met de volgende ingrediënten, het moet niet te moeilijk zijn: ' . $ingredients . ' ik kook voor ' . $persons . ' personen'],
            ],
            'response_format' => [
                'type' => 'json_object',
            ],
        ]);

        $decoded = json_decode($result->choices[0]->message->content, true);
        return response()->json( $decoded);
    }


}
