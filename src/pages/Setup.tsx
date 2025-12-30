import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameStore, type PlayerType, type Difficulty } from '../store/gameStore';

/**
 * Game setup page for configuring players
 */
export const Setup: React.FC = () => {
    const { gameType } = useParams<{ gameType: 'banting' | 'susun' }>();
    const navigate = useNavigate();
    const { players, updatePlayer, initializeSetup, startGame } = useGameStore();

    // Initialize setup on mount
    React.useEffect(() => {
        if (gameType) {
            initializeSetup(gameType as 'banting' | 'susun');
        }
    }, [gameType, initializeSetup]);

    const handlePlayerTypeChange = (playerId: number, type: PlayerType) => {
        updatePlayer(playerId, {
            type,
            difficulty: type === 'bot' ? 'easy' : undefined
        });
    };

    const handleDifficultyChange = (playerId: number, difficulty: Difficulty) => {
        updatePlayer(playerId, { difficulty });
    };

    const handleStartGame = () => {
        startGame();
        navigate(`/game/${gameType}`);
    };

    const handleBack = () => {
        navigate('/');
    };

    // Get game display name
    const gameDisplayName = gameType === 'banting' ? 'Capsa Banting' : 'Capsa Susun';
    const gameEmoji = gameType === 'banting' ? '⚡' : '🏆';
    const accentColor = gameType === 'banting' ? 'emerald' : 'indigo';

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-1/3 left-1/3 w-96 h-96 bg-${accentColor}-500/10 rounded-full blur-3xl`} />
            </div>

            <div className="relative z-10 w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-10">
                    <button
                        onClick={handleBack}
                        className="absolute left-0 top-0 text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                    >
                        <span>←</span>
                        <span>Back</span>
                    </button>

                    <div className="flex items-center justify-center gap-3 mb-2">
                        <span className="text-4xl">{gameEmoji}</span>
                        <h1 className="text-4xl font-bold text-white">
                            Setup {gameDisplayName}
                        </h1>
                    </div>
                    <p className="text-slate-400">Configure your opponents</p>
                </div>

                {/* Player Slots */}
                <div className="glass-panel p-6 mb-8">
                    <div className="space-y-4">
                        {players.map((player) => (
                            <div
                                key={player.id}
                                className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-xl"
                            >
                                {/* Position indicator */}
                                <div className={`
                  w-16 text-center text-sm font-medium px-2 py-1 rounded
                  ${player.position === 'bottom'
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : 'bg-slate-600/50 text-slate-400'
                                    }
                `}>
                                    {player.position.charAt(0).toUpperCase() + player.position.slice(1)}
                                </div>

                                {/* Player info */}
                                <div className="flex-1">
                                    {player.type === 'human' ? (
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">🎮</span>
                                            <div>
                                                <span className="text-white font-semibold">Human Player (You)</span>
                                                <span className="block text-xs text-slate-400">Your position</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-4">
                                            {/* Player type dropdown */}
                                            <select
                                                value={player.type}
                                                onChange={(e) => handlePlayerTypeChange(player.id, e.target.value as PlayerType)}
                                                className="bg-slate-600 text-white px-4 py-2 rounded-lg border border-slate-500 focus:border-emerald-500 focus:outline-none cursor-pointer"
                                            >
                                                <option value="empty">Empty</option>
                                                <option value="bot">Bot</option>
                                            </select>

                                            {/* Difficulty dropdown (if bot) */}
                                            {player.type === 'bot' && (
                                                <select
                                                    value={player.difficulty || 'easy'}
                                                    onChange={(e) => handleDifficultyChange(player.id, e.target.value as Difficulty)}
                                                    className="bg-slate-600 text-white px-4 py-2 rounded-lg border border-slate-500 focus:border-emerald-500 focus:outline-none cursor-pointer"
                                                >
                                                    <option value="easy">🎯 Easy (Random)</option>
                                                    <option value="hard">🤖 Hard (Coming Soon)</option>
                                                </select>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Status indicator */}
                                <div className={`
                  w-3 h-3 rounded-full
                  ${player.type === 'empty'
                                        ? 'bg-slate-500'
                                        : player.type === 'human'
                                            ? 'bg-emerald-500'
                                            : 'bg-indigo-500'
                                    }
                `} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info box */}
                <div className="glass-panel p-4 mb-8 flex items-start gap-3">
                    <span className="text-xl">ℹ️</span>
                    <div className="text-sm text-slate-400">
                        <p className="font-medium text-slate-300 mb-1">Game Info</p>
                        <p>
                            {gameType === 'banting'
                                ? 'Capsa Banting is a shedding-type card game. Players take turns playing cards trying to empty their hands first.'
                                : 'Capsa Susun is a comparing card game. Arrange 13 cards into three poker hands.'}
                        </p>
                    </div>
                </div>

                {/* Start button */}
                <div className="text-center">
                    <button
                        onClick={handleStartGame}
                        className={`
              btn-primary text-lg px-12 py-4
              ${gameType === 'susun' ? 'bg-indigo-500 hover:bg-indigo-600 hover:shadow-indigo-500/30' : ''}
            `}
                    >
                        🎮 Start Game
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Setup;
