import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import PlayerSpot from '../components/PlayerSpot';

/**
 * Game Table page showing the poker table and player positions
 */
export const GameTable: React.FC = () => {
    const { gameType } = useParams<{ gameType: 'banting' | 'susun' }>();
    const navigate = useNavigate();
    const { players, playerHands, gameState, startGame, resetGame } = useGameStore();

    // Deal cards on mount if not already playing
    React.useEffect(() => {
        if (gameState !== 'playing') {
            startGame();
        }
    }, [gameState, startGame]);

    const handleExit = () => {
        resetGame();
        navigate('/');
    };

    const handleNewGame = () => {
        startGame();
    };

    // Get players by position
    const getPlayerByPosition = (position: 'bottom' | 'left' | 'top' | 'right') => {
        return players.find((p) => p.position === position) || players[0];
    };

    // Get game display info
    const gameDisplayName = gameType === 'banting' ? 'Capsa Banting' : 'Capsa Susun';
    const gameEmoji = gameType === 'banting' ? '⚡' : '🏆';

    return (
        <div className="min-h-screen flex flex-col p-4 sm:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={handleExit}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
                >
                    <span>←</span>
                    <span>Exit to Menu</span>
                </button>

                <div className="flex items-center gap-2">
                    <span className="text-2xl">{gameEmoji}</span>
                    <h1 className="text-xl font-bold text-white">{gameDisplayName}</h1>
                </div>

                <button
                    onClick={handleNewGame}
                    className="text-sm px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                    🔄 New Deal
                </button>
            </div>

            {/* Game Table Container */}
            <div className="flex-1 flex items-center justify-center">
                <div className="poker-table w-full max-w-5xl aspect-[16/10] rounded-[40%] relative flex items-center justify-center">
                    {/* Center area */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-6xl mb-2 opacity-30">🎴</div>
                            <p className="text-emerald-200/50 text-sm">
                                {gameType === 'banting' ? 'Play your cards!' : 'Arrange your hand'}
                            </p>
                        </div>
                    </div>

                    {/* Top Player */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2">
                        <PlayerSpot
                            player={getPlayerByPosition('top')}
                            cards={playerHands[getPlayerByPosition('top').id] || []}
                        />
                    </div>

                    {/* Left Player */}
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <PlayerSpot
                            player={getPlayerByPosition('left')}
                            cards={playerHands[getPlayerByPosition('left').id] || []}
                        />
                    </div>

                    {/* Right Player */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <PlayerSpot
                            player={getPlayerByPosition('right')}
                            cards={playerHands[getPlayerByPosition('right').id] || []}
                        />
                    </div>

                    {/* Bottom Player (You) */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full px-8 flex justify-center">
                        <PlayerSpot
                            player={getPlayerByPosition('bottom')}
                            cards={playerHands[getPlayerByPosition('bottom').id] || []}
                            isCurrentPlayer
                        />
                    </div>
                </div>
            </div>

            {/* Game Status Bar */}
            <div className="mt-4 flex items-center justify-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span>Game Active</span>
                </div>
                <div>•</div>
                <div>
                    {players.filter((p) => p.type !== 'empty').length} Players
                </div>
                <div>•</div>
                <div className="flex items-center gap-2">
                    <span>🎴</span>
                    <span>13 cards each</span>
                </div>
            </div>
        </div>
    );
};

export default GameTable;
