import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api/client';
import { FlashcardsResponse } from '../types';
import { Sparkles, AlertCircle, ChevronLeft, ChevronRight, Eye, EyeOff, Layers } from 'lucide-react';

interface FlashcardsPanelProps {
    fileId: string;
}

export const FlashcardsPanel: React.FC<FlashcardsPanelProps> = ({ fileId }) => {
    const [data, setData] = useState<FlashcardsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    const pollInterval = useRef<ReturnType<typeof setInterval> | null>(null);
    const pollCount = useRef(0);

    const fetchStatus = async () => {
        try {
            const response = await api.getFlashcards(fileId);
            setData(response);
            return response;
        } catch (err) {
            console.error(err);
            setError('Failed to fetch flashcards status');
            return null;
        }
    };

    const startPolling = () => {
        if (pollInterval.current) clearInterval(pollInterval.current);
        pollCount.current = 0;

        pollInterval.current = setInterval(async () => {
            pollCount.current += 1;
            const res = await fetchStatus();

            if (res?.status === 'ready' || res?.status === 'failed') {
                if (pollInterval.current) clearInterval(pollInterval.current);
                setLoading(false);
            } else if (pollCount.current > 45) { // 90s
                if (pollInterval.current) clearInterval(pollInterval.current);
                setLoading(false);
                setError('Flashcard generation timed out.');
            }
        }, 2000);
    };

    useEffect(() => {
        fetchStatus();
        return () => {
            if (pollInterval.current) clearInterval(pollInterval.current);
        };
    }, [fileId]);

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        try {
            await api.triggerFlashcards(fileId);
            const res = await fetchStatus();
            if (res?.status !== 'ready') {
                startPolling();
            } else {
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to trigger flashcard generation');
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (data?.flashcards && activeIndex < data.flashcards.length - 1) {
            setActiveIndex(prev => prev + 1);
            setShowAnswer(false);
        }
    };

    const handlePrev = () => {
        if (activeIndex > 0) {
            setActiveIndex(prev => prev - 1);
            setShowAnswer(false);
        }
    };

    if (!data) return <div className="p-8 text-center text-stitch-subtext">Loading...</div>;

    if (loading || data.status === 'queued' || data.status === 'processing') {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl card-shadow">
                <div className="w-12 h-12 border-4 border-stitch-blue border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-stitch-text font-medium">Generating flashcards...</p>
            </div>
        );
    }

    if (data.status === 'not_generated') {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl card-shadow text-center">
                <div className="bg-purple-100 p-4 rounded-full mb-4">
                    <Layers className="text-purple-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-stitch-text mb-2">AI Flashcards</h3>
                <p className="text-stitch-subtext mb-6 max-w-sm">
                    Automatically generate flashcards to test your knowledge of this document.
                </p>
                <button onClick={handleGenerate} className="bg-stitch-text text-white px-6 py-3 rounded-xl font-medium hover:bg-black transition-colors flex items-center shadow-lg">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Flashcards
                </button>
            </div>
        );
    }

    if (data.status === 'ready' && data.flashcards && data.flashcards.length > 0) {
        const currentCard = data.flashcards[activeIndex];
        return (
            <div className="flex flex-col h-[500px]"> {/* Fixed height for consistency */}
                <div className="flex-1 bg-white rounded-2xl card-shadow p-8 flex flex-col items-center justify-center text-center relative mb-6">
                    <div className="absolute top-4 right-4 text-xs font-medium text-stitch-subtext bg-gray-100 px-2 py-1 rounded-full">
                        {activeIndex + 1} / {data.flashcards.length}
                    </div>

                    <div className="max-w-md w-full">
                        <h4 className="text-sm font-semibold text-stitch-subtext uppercase tracking-wider mb-4">
                            {showAnswer ? 'Answer' : 'Question'}
                        </h4>
                        <p className={`text-xl md:text-2xl text-stitch-text font-medium animate-in fade-in duration-300 ${showAnswer ? 'text-stitch-blue' : ''}`}>
                            {showAnswer ? currentCard.answer : currentCard.question}
                        </p>
                    </div>

                    <button
                        onClick={() => setShowAnswer(!showAnswer)}
                        className="mt-8 flex items-center text-stitch-subtext hover:text-stitch-text transition-colors"
                    >
                        {showAnswer ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                        {showAnswer ? 'Hide Answer' : 'Show Answer'}
                    </button>
                </div>

                <div className="flex items-center justify-between px-4">
                    <button
                        onClick={handlePrev}
                        disabled={activeIndex === 0}
                        className={`p-4 rounded-full card-shadow bg-white transition-all ${activeIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button
                        onClick={() => setShowAnswer(prev => !prev)}
                        className="px-8 py-3 bg-stitch-text text-white rounded-xl font-medium shadow-md hover:bg-black transition-colors"
                    >
                        {showAnswer ? 'Next Card' : 'Reveal'}
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={activeIndex === data.flashcards.length - 1}
                        className={`p-4 rounded-full card-shadow bg-white transition-all ${activeIndex === data.flashcards.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl card-shadow text-center">
            <AlertCircle className="text-red-500 w-8 h-8 mb-4" />
            <p className="text-stitch-text">{error || 'Failed to load flashcards'}</p>
            <button onClick={handleGenerate} className="mt-4 text-stitch-blue hover:text-blue-700">Try Again</button>
        </div>
    );
};
