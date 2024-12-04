import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

export default function Help() {
    const { props } = usePage();

    const [chats, setChats] = useState(props.chats || []);
    const [message, setMessage] = useState('');
    const chatContainerRef = useRef(null); // Create a ref for the chat container

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    }, [chats]);

    const sendChatMessage = (e) => {
        e.preventDefault();

        let savedMessage = message;
        setMessage('');

        setChats((prevChats) => [
            ...prevChats,
            { content: message, role: 'user' },
        ]);

        axios
            .post(route('api.sendChat'), {
                message: message,
            })
            .then((response) => {
                console.log(response.data); // Handle the response data
                setChats((prevChats) => [...prevChats, response.data]);
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
                    <div
                        className="flex-grow space-y-4 overflow-y-auto p-6"
                        ref={chatContainerRef}
                    >
                        {chats.map((chat, index) => (
                            <div
                                key={index}
                                className={`flex ${chat.role === 'bot' ? 'items-start' : 'items-end justify-end'}`}
                            >
                                <div
                                    className={`max-w-lg px-4 py-3 ${chat.role === 'bot' ? 'bg-gray-100 text-gray-900' : 'bg-blue-600 text-white'} rounded-lg`}
                                >
                                    {chat.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-300 p-4">
                        <form
                            className="flex items-center space-x-4"
                            onSubmit={sendChatMessage}
                        >
                            <input
                                type="text"
                                value={message}
                                max={500}
                                onChange={(e) => {
                                    if (e.target.value.length > 500) {
                                        e.target.value = e.target.value.slice(
                                            0,
                                            500,
                                        ); // Truncate any extra input
                                    } else {
                                        setMessage(e.target.value);
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
