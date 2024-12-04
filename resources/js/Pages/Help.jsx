import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

export default function Help() {
    const { props } = usePage();

    const [chats, setChats] = useState([props.chats]);

    console.log(chats);

    const sendChatMessage = (e) => {
        e.preventDefault();
        const message = e.target[0].value;
        console.log(message);

        axios
            .post(route('api.sendChat'), {
                message: message, // This should be in 'd-m-Y' format
            })
            .then((response) => {
                console.log(response.data); // Handle the response data
            })
            .catch((error) => {
                console.error('Error fetching timeslots:', error);
            });
    };

    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-slate-900">
            <h1 className="text-4xl font-bold text-white">
                Vraag het aan onze chatbot
            </h1>
            <div className="container mx-auto">
                <div className="mx-auto flex h-[700px] w-full max-w-3xl flex-col rounded-lg bg-white shadow-xl">
                    <div className="flex-grow space-y-4 overflow-y-auto p-6">
                        <div className="flex items-start">
                            <div className="max-w-lg rounded-lg bg-gray-100 px-4 py-3 text-gray-900">
                                Hello! How can I assist you today?
                            </div>
                        </div>
                        <div className="flex items-end justify-end">
                            <div className="max-w-lg rounded-lg bg-blue-600 px-4 py-3 text-white">
                                I need help with my project
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-300 p-4">
                        <form
                            className="flex items-center space-x-4"
                            onSubmit={sendChatMessage}
                        >
                            <input
                                type="text"
                                max={500}
                                onChange={(e) => {
                                    if (e.target.value.length > 500) {
                                        e.target.value = e.target.value.slice(
                                            0,
                                            500,
                                        ); // Truncate any extra input
                                    }
                                }}
                                placeholder="Type your message..."
                                className="flex-grow rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="rounded-lg bg-blue-500 px-5 py-3 text-white transition hover:bg-blue-600"
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
