import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { FileItem, SearchResult } from '../types';
import { FileCard } from '../components/FileCard';
import { SearchBar } from '../components/SearchBar';
import { LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';

const Library: React.FC = () => {
    const [files, setFiles] = useState<(FileItem | SearchResult)[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const data = await api.getFiles();
            setFiles(data);
        } catch (err) {
            console.error(err);
            setError('Failed to load files');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleSearch = async (query: string, mode: 'normal' | 'ai') => {
        if (!query.trim()) {
            fetchFiles();
            return;
        }

        setLoading(true);
        try {
            let results;
            if (mode === 'ai') {
                results = await api.semanticSearch(query);
            } else {
                results = await api.searchFiles(query);
            }
            setFiles(results);
        } catch (err) {
            console.error(err);
            setError('Search failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    return (
        <div className="max-w-2xl mx-auto p-4 pb-24">
            <header className="flex items-center justify-between mb-6 pt-4">
                <h1 className="text-2xl font-bold text-stitch-text dark:text-white">Library</h1>
            </header>

            <SearchBar onSearch={handleSearch} />

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4 text-sm">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-20 bg-white dark:bg-gray-800 rounded-2xl animate-pulse card-shadow"></div>
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {files.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                            <LayoutGrid className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-500 dark:text-gray-400 font-medium">No files found</p>
                            <Link to="/upload" className="text-stitch-blue hover:underline text-sm mt-1 inline-block">
                                Upload a file
                            </Link>
                        </div>
                    ) : (
                        files.map(file => (
                            <FileCard key={file.id} file={file} onDelete={handleDelete} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Library;
