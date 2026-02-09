import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutGrid, Settings, Upload, Sparkles } from 'lucide-react';

export const BottomNav: React.FC = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-3 flex justify-between items-center z-30 pb-safe transition-colors duration-300">
            <NavLink
                to="/"
                className={({ isActive }) =>
                    `flex flex-col items-center space-y-1 ${isActive ? 'text-stitch-blue' : 'text-stitch-subtext dark:text-gray-400 hover:text-stitch-blue dark:hover:text-stitch-blue'}`
                }
            >
                <Home className="w-6 h-6" />
                <span className="text-[10px] font-medium">Home</span>
            </NavLink>

            <NavLink
                to="/library"
                className={({ isActive }) =>
                    `flex flex-col items-center space-y-1 ${isActive ? 'text-stitch-blue' : 'text-stitch-subtext dark:text-gray-400 hover:text-stitch-blue dark:hover:text-stitch-blue'}`
                }
            >
                <LayoutGrid className="w-6 h-6" />
                <span className="text-[10px] font-medium">Library</span>
            </NavLink>

            <NavLink
                to="/upload"
                className="flex flex-col items-center text-stitch-subtext dark:text-gray-400 hover:text-stitch-blue dark:hover:text-stitch-blue space-y-1 transition-colors"
            >
                <div className="bg-stitch-blue text-white p-3 rounded-full -mt-8 shadow-lg border-4 border-stitch-bg dark:border-gray-900 transition-colors duration-300">
                    <Upload className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-medium">Upload</span>
            </NavLink>

            <NavLink
                to="/ai"
                className={({ isActive }) =>
                    `flex flex-col items-center space-y-1 ${isActive ? 'text-purple-600' : 'text-stitch-subtext dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'}`
                }
            >
                <Sparkles className="w-6 h-6" />
                <span className="text-[10px] font-medium">AI Tools</span>
            </NavLink>

            <NavLink
                to="/settings"
                className={({ isActive }) =>
                    `flex flex-col items-center space-y-1 ${isActive ? 'text-stitch-blue' : 'text-stitch-subtext dark:text-gray-400 hover:text-stitch-blue dark:hover:text-stitch-blue'}`
                }
            >
                <Settings className="w-6 h-6" />
                <span className="text-[10px] font-medium">Settings</span>
            </NavLink>
        </div>
    );
};
