import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Info, ChevronRight, Shield, Bell } from 'lucide-react';

const Settings: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="max-w-2xl mx-auto p-4 pb-24">
            <header className="flex items-center justify-between mb-8 pt-4">
                <h1 className="text-2xl font-bold text-stitch-text dark:text-white">Settings</h1>
            </header>

            <div className="space-y-6">
                {/* Appearance Section */}
                <section>
                    <h2 className="text-sm font-semibold text-stitch-subtext dark:text-gray-400 uppercase tracking-wider mb-3 ml-1">Appearance</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl card-shadow overflow-hidden">
                        <button
                            onClick={toggleTheme}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-purple-100 text-purple-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                    {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                                </div>
                                <span className="font-medium text-stitch-text dark:text-white">Dark Mode</span>
                            </div>
                            <div className={`w-12 h-7 rounded-full p-1 transition-colors ${theme === 'dark' ? 'bg-stitch-blue' : 'bg-gray-300'}`}>
                                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${theme === 'dark' ? 'translate-x-5' : ''}`} />
                            </div>
                        </button>
                    </div>
                </section>

                {/* General Section */}
                <section>
                    <h2 className="text-sm font-semibold text-stitch-subtext dark:text-gray-400 uppercase tracking-wider mb-3 ml-1">General</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl card-shadow overflow-hidden divide-y divide-gray-100 dark:divide-gray-700">
                        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <span className="font-medium text-stitch-text dark:text-white">Privacy & Security</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>

                        <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-red-100 text-red-600 rounded-full">
                                    <Bell className="w-5 h-5" />
                                </div>
                                <span className="font-medium text-stitch-text dark:text-white">Notifications</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </section>

                {/* About Section */}
                <section>
                    <h2 className="text-sm font-semibold text-stitch-subtext dark:text-gray-400 uppercase tracking-wider mb-3 ml-1">About</h2>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl card-shadow overflow-hidden">
                        <div className="p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                                    <Info className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="font-medium text-stitch-text dark:text-white">Snapstd</span>
                                    <span className="text-xs text-stitch-subtext dark:text-gray-500">Version 1.0.0 (Local Build)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="mt-8 text-center">
                <p className="text-xs text-stitch-subtext dark:text-gray-600">Built with ❤️ using React + Vite</p>
            </div>
        </div>
    );
};

export default Settings;
