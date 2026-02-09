import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export const Layout: React.FC = () => {
    const location = useLocation();
    // Hide bottom nav on specific pages if needed, e.g., inside a document detail
    // For now, we keep it everywhere except maybe DocumentDetail if we want full screen
    const hideNav = location.pathname.startsWith('/file/');

    return (
        <div className="min-h-screen bg-stitch-bg dark:bg-gray-900 text-stitch-text dark:text-gray-100 transition-colors duration-300">
            <div className={`pb-${hideNav ? '0' : '20'} md:pb-0`}>
                <Outlet />
            </div>
            {!hideNav && <BottomNav />}
        </div>
    );
};
