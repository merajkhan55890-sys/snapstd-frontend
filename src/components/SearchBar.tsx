import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

interface SearchBarProps {
    onSearch: (query: string, mode: 'normal' | 'ai') => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [mode, setMode] = useState<'normal' | 'ai'>('normal');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query, mode);
    };

    const toggleMode = () => {
        const newMode = mode === 'normal' ? 'ai' : 'normal';
        setMode(newMode);
        // Optional: Trigger search immediately on toggle if query exists
        // if (query) onSearch(query, newMode);
    };

    return (
        <form onSubmit={handleSubmit} className="relative mb-6">
            <div className="relative flex items-center">
                <Search className="absolute left-4 text-stitch-subtext w-5 h-5" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={mode === 'ai' ? "Ask AI about your files..." : "Search files..."}
                    className={`w-full pl-12 pr-14 py-3 rounded-full border-none focus:ring-2 outline-none transition-all shadow-sm ${mode === 'ai'
                            ? 'bg-purple-50 focus:ring-purple-200 text-purple-900 placeholder-purple-300'
                            : 'bg-white focus:ring-blue-100 text-stitch-text placeholder-gray-400'
                        }`}
                />
                <button
                    type="button"
                    onClick={toggleMode}
                    className={`absolute right-2 p-2 rounded-full transition-colors ${mode === 'ai' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-stitch-blue hover:bg-gray-100'
                        }`}
                    title="Toggle AI Search"
                >
                    <Sparkles size={20} fill={mode === 'ai' ? "currentColor" : "none"} />
                </button>
            </div>
        </form>
    );
};
