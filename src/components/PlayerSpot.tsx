import React from 'react';
import { type Player } from '../store/gameStore';
import { type Card as CardType } from '../utils/deck';
import Card from './Card';

interface PlayerSpotProps {
    player: Player;
    cards: CardType[];
    isCurrentPlayer?: boolean;
}

/**
 * Player spot component showing player info and their cards
 */
export const PlayerSpot: React.FC<PlayerSpotProps> = ({
    player,
    cards,
    isCurrentPlayer = false
}) => {
    const isEmpty = player.type === 'empty';
    const isHuman = player.type === 'human';
    const isBottom = player.position === 'bottom';
    const isVertical = player.position === 'left' || player.position === 'right';

    // Get display name
    const displayName = player.type === 'bot'
        ? `${player.name}`
        : player.type === 'human'
            ? 'You'
            : 'Empty Slot';

    // Avatar placeholder based on player type
    const getAvatarEmoji = () => {
        if (isEmpty) return '👤';
        if (isHuman) return '🎮';
        return player.difficulty === 'hard' ? '🤖' : '🎯';
    };

    // Container classes based on position
    const containerClasses = isBottom
        ? 'w-full max-w-3xl'
        : isVertical
            ? 'w-32 h-auto'
            : 'w-64';

    // Render cards
    const renderCards = () => {
        if (isEmpty || cards.length === 0) {
            return (
                <div className="text-slate-500 text-sm italic py-2">
                    {isEmpty ? 'No player' : 'No cards'}
                </div>
            );
        }

        // Bottom player sees face-up cards
        if (isBottom) {
            return (
                <div className="card-hand justify-center flex-wrap gap-y-2 py-2">
                    {cards.map((card) => (
                        <Card key={card.id} card={card} faceUp={true} />
                    ))}
                </div>
            );
        }

        // Other players see face-down cards
        if (isVertical) {
            // Vertical layout for left/right
            return (
                <div className="flex flex-col items-center gap-1 py-2">
                    <div className="flex gap-0.5">
                        {cards.slice(0, 4).map((card) => (
                            <Card key={card.id} faceUp={false} small />
                        ))}
                    </div>
                    <span className="text-xs text-slate-400">{cards.length} cards</span>
                </div>
            );
        }

        // Horizontal layout for top
        return (
            <div className="flex items-center justify-center gap-0.5 py-2">
                {cards.slice(0, 6).map((card) => (
                    <Card key={card.id} faceUp={false} small />
                ))}
                <span className="text-xs text-slate-400 ml-2">({cards.length})</span>
            </div>
        );
    };

    return (
        <div
            className={`
        player-spot
        ${containerClasses}
        ${isCurrentPlayer ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-transparent' : ''}
        ${isEmpty ? 'opacity-50' : ''}
      `}
        >
            {/* Player info header */}
            <div className={`flex items-center gap-3 ${isVertical ? 'flex-col' : ''} mb-2`}>
                {/* Avatar */}
                <div className={`
          w-10 h-10 rounded-full 
          flex items-center justify-center text-xl
          ${isEmpty
                        ? 'bg-slate-700'
                        : isHuman
                            ? 'bg-gradient-to-br from-emerald-400 to-emerald-600'
                            : 'bg-gradient-to-br from-indigo-400 to-indigo-600'
                    }
        `}>
                    {getAvatarEmoji()}
                </div>

                {/* Name and info */}
                <div className={`${isVertical ? 'text-center' : ''}`}>
                    <h3 className="font-semibold text-white text-sm">{displayName}</h3>
                    {player.type === 'bot' && (
                        <span className={`
              text-xs px-2 py-0.5 rounded-full
              ${player.difficulty === 'hard'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }
            `}>
                            {player.difficulty === 'hard' ? 'Hard' : 'Easy'}
                        </span>
                    )}
                </div>
            </div>

            {/* Cards area */}
            <div className={`
        ${isBottom ? 'min-h-28' : 'min-h-16'}
        flex items-center justify-center
      `}>
                {renderCards()}
            </div>
        </div>
    );
};

export default PlayerSpot;
