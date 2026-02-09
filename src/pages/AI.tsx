import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AI: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="max-w-2xl mx-auto p-4 min-h-screen bg-gradient-to-br from-purple-50 to-white">
            <header className="flex items-center mb-8 pt-4">
                <button onClick={() => navigate('/')} className="p-2 -ml-2 rounded-full hover:bg-white/50 text-stitch-subtext">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-semibold text-stitch-text ml-2">Snapstd AI</h1>
            </header>

            <div className="flex flex-col items-center text-center mt-12 px-4">
                <div className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-xl mb-8 transform rotate-3">
                    <Sparkles className="text-white w-10 h-10" />
                </div>

                <h2 className="text-3xl font-bold text-stitch-text mb-4">Supercharge your study</h2>
                <p className="text-lg text-stitch-subtext mb-12 max-w-sm">
                    Upload any document and let our AI generate summaries, create flashcards, and answer your questions instantly.
                </p>

                <div className="grid gap-6 w-full max-w-sm">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 flex items-center space-x-4">
                        <span className="text-2xl">📝</span>
                        <div className="text-left">
                            <h3 className="font-semibold text-stitch-text">Auto Summary</h3>
                            <p className="text-sm text-stitch-subtext">Get the gist in seconds</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 flex items-center space-x-4">
                        <span className="text-2xl">🎴</span>
                        <div className="text-left">
                            <h3 className="font-semibold text-stitch-text">Flashcards</h3>
                            <p className="text-sm text-stitch-subtext">Active recall made easy</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 flex items-center space-x-4">
                        <span className="text-2xl">💬</span>
                        <div className="text-left">
                            <h3 className="font-semibold text-stitch-text">Chat with Doc</h3>
                            <p className="text-sm text-stitch-subtext">Ask anything, get answers</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/upload')}
                    className="mt-12 w-full max-w-xs bg-stitch-text text-white py-4 rounded-xl font-semibold shadow-lg hover:bg-black transition-transform active:scale-95"
                >
                    Try it now
                </button>
            </div>
        </div>
    );
};

export default AI;
