
import React from 'react';

const Logo = () => (
    <svg width="128" height="128" viewBox="0 0 24 24" className="text-primary-500" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10Z"/>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 16s.833-2.5 3-2.5 3 2.5 3 2.5M9.5 9a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1ZM14.5 9a.5.5 0 1 0 0-1a.5.5 0 0 0 0 1Z"/>
      </g>
    </svg>
);


export const SplashScreen = () => {
    return (
        <div className="bg-gray-50 dark:bg-gray-900 h-screen flex flex-col justify-center items-center text-gray-800 dark:text-gray-200 animate-fade-in">
            <div className="flex flex-col items-center gap-4">
                <Logo />
                <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400 tracking-wider">BEHO Cycle</h1>
                <p className="text-gray-500 dark:text-gray-400">Your personal health companion.</p>
            </div>
            <div className="absolute bottom-4 text-xs text-gray-400 dark:text-gray-500">
                Version 1.0.8
            </div>
             <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in { animation: fadeIn 1.5s ease-in-out; }
            `}</style>
        </div>
    );
};