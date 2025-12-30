import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Main Menu page with game selection buttons
 */
export const Menu: React.FC = () => {
    const navigate = useNavigate();

    const handleGameSelect = (gameType: 'banting' | 'susun') => {
        navigate(`/setup/${gameType}`);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center">
                {/* Logo / Title area */}
                <div className="mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <span className="text-5xl">🎴</span>
                        <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 bg-clip-text text-transparent">
                            React Capsa Hub
                        </h1>
                        <span className="text-5xl">🃏</span>
                    </div>
                    <p className="text-slate-400 text-lg max-w-md mx-auto">
                        Choose your game mode and challenge yourself against AI opponents
                    </p>
                </div>

                {/* Game selection buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                    {/* Capsa Banting Button */}
                    <button
                        onClick={() => handleGameSelect('banting')}
                        className="group glass-panel px-10 py-8 hover:bg-emerald-500/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20"
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                                ⚡
                            </div>
                            <h2 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                                Capsa Banting
                            </h2>
                            <p className="text-slate-400 text-sm max-w-48">
                                Fast-paced card shedding game. Be the first to empty your hand!
                            </p>
                            <div className="flex items-center gap-2 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span>Play Now</span>
                                <span>→</span>
                            </div>
                        </div>
                    </button>

                    {/* Capsa Susun Button */}
                    <button
                        onClick={() => handleGameSelect('susun')}
                        className="group glass-panel px-10 py-8 hover:bg-indigo-500/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20"
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                                🏆
                            </div>
                            <h2 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                                Capsa Susun
                            </h2>
                            <p className="text-slate-400 text-sm max-w-48">
                                Strategic hand arrangement. Build three winning combinations!
                            </p>
                            <div className="flex items-center gap-2 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span>Play Now</span>
                                <span>→</span>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-16 text-slate-500 text-sm">
                    <p>Built with React • TypeScript • Zustand • TailwindCSS</p>
                </div>
            </div>
        </div>
    );
};

export default Menu;
