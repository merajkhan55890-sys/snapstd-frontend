import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { FileItem, SearchResult } from '../types';
import { FileCard } from '../components/FileCard';
import { Upload, Sparkles, ChevronRight, User, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
//import { useTheme } from '../context/ThemeContext';

const Dashboard: React.FC = () => {
    const [recentFiles, setRecentFiles] = useState<(FileItem | SearchResult)[]>([]);
    const [loading, setLoading] = useState(true);
 //const { toggleTheme } = useTheme(); // Just for access if needed

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const data = await api.getFiles();
                // Simulate "recent" by taking first 3
                setRecentFiles(data.slice(0, 3));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRecent();
    }, []);

    return (
        <div className="max-w-xl mx-auto p-4 pb-24">
            {/* Header */}
            <header className="flex items-center justify-between mb-8 pt-4">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-stitch-blue to-purple-600 bg-clip-text text-transparent">
                        Snapstd
                    </h1>
                    <p className="text-xs font-medium text-stitch-subtext dark:text-gray-400">Welcome back!</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-stitch-subtext dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                    </button>
                    <button
                        onClick={() => { }} // Could go to profile page
                        className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 p-0.5"
                    >
                        <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                            <User className="w-5 h-5 text-gray-400" />
                            {/* <img src="..." alt="Profile" /> */}
                        </div>
                    </button>
                </div>
            </header>

            {/* Hero / Action Section */}
            <div className="mb-8 p-6 bg-gradient-to-br from-stitch-blue to-blue-600 rounded-3xl shadow-lg text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/20 rounded-full -ml-8 -mb-8 blur-xl"></div>

                <div className="relative z-10">
                    <h2 className="text-xl font-bold mb-2">Upload New Document</h2>
                    <p className="text-blue-100 text-sm mb-6 max-w-[80%]">
                        Prepare for your exams by uploading your study materials.
                    </p>

                    <div className="flex space-x-3">
                        <Link
                            to="/upload"
                            className="flex-1 bg-white text-stitch-blue py-3 rounded-xl font-semibold text-sm flex items-center justify-center shadow-sm hover:bg-blue-50 transition-colors"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload
                        </Link>
                        <Link
                            to="/ai"
                            className="px-4 bg-white/20 backdrop-blur-sm text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                            <Sparkles className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Shortcuts */}
            {/* <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-14 h-14 bg-purple-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-purple-600">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium text-stitch-text dark:text-gray-300">AI Chat</span>
        </div>
        ... Add more shortcuts if needed
      </div> */}

            {/* Recent Activity */}
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-stitch-text dark:text-white">Recent Files</h3>
                <Link to="/library" className="text-sm font-medium text-stitch-blue hover:text-blue-700 flex items-center">
                    View All <ChevronRight className="w-4 h-4 ml-0.5" />
                </Link>
            </div>

            <div className="space-y-3">
                {loading ? (
                    [1, 2].map(i => (
                        <div key={i} className="h-20 bg-white dark:bg-gray-800 rounded-2xl animate-pulse card-shadow"></div>
                    ))
                ) : recentFiles.length > 0 ? (
                    recentFiles.map(file => (
                        <FileCard key={file.id} file={file} onDelete={() => {
                            setRecentFiles(prev => prev.filter(f => f.id !== file.id));
                        }} />
                    ))
                ) : (
                    <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-stitch-subtext dark:text-gray-400">No recent activity</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
