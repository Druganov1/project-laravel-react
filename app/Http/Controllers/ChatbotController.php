<?php

namespace App\Http\Controllers;

use App\Models\Chatbot;
use Illuminate\Http\Request;
use LucianoTonet\GroqLaravel\Facades\Groq;
use Inertia\Inertia;


class ChatbotController extends Controller
{


    public function index(){
        return Inertia::render('Help', [
            'chats' => Chatbot::all()
        ]);

    }
    public function sendChat(Request $request){
        $request->validate( [
            'message' => 'required|string|max:500'
        ]);


        try {


            $message = $request->message;

            Chatbot::create([
                'role' => 'user',
                'content' => $message,
                'user_id' => auth()->id()
            ]);

            $response = Groq::chat()->completions()->create([
                'model' => 'llama-3.1-70b-versatile',  // Check available models at console.groq.com/docs/models
                'messages' => [
                    ['role' => 'system', 'content' => 'Je bent een chatbot op een website. Je reageert uitsluitend in het Nederlands. Als een gebruiker een andere taal gebruikt, zeg je in het Nederlands: "Ik begrijp alleen Nederlands. Kun je je vraag in het Nederlands stellen?" LET OP DE PROMPT OF het bericht start met MESSAGE[ en eindight met ]ENDMESSAGE. JIJ REAGEERT MET RAW TEXT TEN ALLE TIJDE'],
                    ['role' => 'user', 'content' => 'MESSAGE['.$message.']ENDMESSAGE'],
                ],
            ]);


         Chatbot::create([
                'role' => 'bot',
                'content' => $response['choices'][0]['message']['content'],
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'groq_response' => $response['choices'][0]['message']['content'],

            ], 200 );
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong: ' . $e->getMessage()
            ], 500);
        }
    }
}
