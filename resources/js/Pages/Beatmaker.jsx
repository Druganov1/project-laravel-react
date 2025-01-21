import { useState } from 'react';
import * as Tone from 'tone';
import AuthenticatedLayout from '../Layouts/AuthenticatedLayout';

export default function Beatmaker() {
    const [isPlaying, setIsPlaying] = useState(false);

    // Initialize polyphonic synth for richer sound
    const synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: {
            type: 'square8',
        },
        envelope: {
            attack: 0.01,
            decay: 0.05,
            sustain: 0.8,
            release: 0.1,
        },
    }).toDestination();

    // Main melody pattern with harmony
    const pattern = [
        { time: 0, notes: ['D4', 'B3'], duration: '8n' },
        { time: 0.125, notes: ['G4', 'D4'], duration: '8n' },
        { time: 0.25, notes: ['G4', 'D4'], duration: '8n' },
        { time: 0.375, notes: ['G4', 'D4'], duration: '8n' },
        { time: 0.5, notes: ['B4', 'G4', 'D4'], duration: '4n' },
        { time: 0.75, notes: ['A4', 'F#4', 'D4'], duration: '4n' },
        { time: 1, notes: ['G4', 'D4', 'B3'], duration: '4n' },
        // und das heißt
        { time: 1.25, notes: ['F#4', 'D4'], duration: '8n' },
        { time: 1.375, notes: ['G4', 'D4'], duration: '8n' },
        { time: 1.5, notes: ['A4', 'F#4', 'D4'], duration: '4n' },
        // Erika!
        { time: 1.75, notes: ['D5', 'B4', 'G4'], duration: '4n' },
        { time: 2, notes: ['C5', 'A4', 'F#4'], duration: '8n' },
        { time: 2.125, notes: ['B4', 'G4', 'D4'], duration: '8n' },
        { time: 2.25, notes: ['A4', 'F#4', 'D4'], duration: '2n' },
    ];

    // Function to play music with proper timing
    const playMusic = async () => {
        await Tone.start();
        Tone.Transport.bpm.value = 120;
        const now = Tone.now();

        pattern.forEach(({ time, notes, duration }) => {
            synth.triggerAttackRelease(notes, duration, now + time);
        });
    };

    // Handle play button click
    const handlePlay = async () => {
        setIsPlaying(true);
        await playMusic();
        setTimeout(() => setIsPlaying(false), 3000); // Reset button after 3 seconds
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Beatmaker
                </h2>
            }
        >
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <button
                                onClick={handlePlay}
                                disabled={isPlaying}
                                className={`rounded px-4 py-2 ${
                                    isPlaying
                                        ? 'bg-gray-400'
                                        : 'bg-blue-500 hover:bg-blue-600'
                                } font-semibold text-white transition-colors`}
                            >
                                {isPlaying ? 'Playing...' : 'Play Erika'}
                            </button>

                            <div className="mt-4">
                                <h3 className="mb-2 font-semibold">
                                    Current Pattern:
                                </h3>
                                <pre className="rounded bg-gray-100 p-4">
                                    {JSON.stringify(pattern, null, 2)}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
