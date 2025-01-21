<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenAI;
use Inertia\Inertia;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Http;

class ImageScannerController extends Controller
{
    public function scanImage(Request $request)
    {
        // Validate uploaded image
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        // Retrieve uploaded image file
        $image = $request->file('image');

        // Convert image to Base64
        $imageBase64 = base64_encode(file_get_contents($image->getPathname()));

        // API Key and Base URL
        $apiKey = config('app.deepseek_api_key');
        $imgbb = config('app.imgbb_api_key');

        // Initialize the client
        \Log::info($imageBase64);

        $yourApiKey = config('app.deepseek_api_key');



            try {
                // first upload image to imgbb


                $response = Http::asForm()->post('https://api.imgbb.com/1/upload', [
                    'expiration' => 60,
                    'key' => $imgbb,
                    'image' => $imageBase64,
                ]);

                $imgbbUrl = $response['data']['url'];




                $response = Http::withHeaders([
                    'Content-Type' => 'application/json',
                    'Authorization' => 'Bearer ' . $yourApiKey,
                ])->post('https://api.deepseek.com/chat/completions', [
                    'model' => 'deepseek-chat',
                    'messages' => [
                        ['role' => 'system', 'content' => 'You are a helpful assistant.'],
                        ['role' => 'user', 'content' => 'Hello!']
                    ],
                    'stream' => false,
                ]);

                \Log::info($response);


                // Return the response as JSON
                return response()->json(json_encode($response));
            } catch (\Exception $e) {
                // Handle errors
                \Log::error('Deepseek API Error: ' . $e->getMessage());
                return response()->json(['error' => 'An error occurred while processing the image.'], 500);
            }
    }
}
