import React from 'react';
import { type Card as CardType, SUIT_SYMBOLS, isRedSuit } from '../utils/deck';

interface CardProps {
    card?: CardType;
    faceUp?: boolean;
    small?: boolean;
}

/**
 * Playing card component that displays either face-up or face-down
 */
export const Card: React.FC<CardProps> = ({ card, faceUp = true, small = false }) => {
    const cardSize = small
        ? 'w-10 h-14 text-xs'
        : 'w-14 h-20 text-sm sm:w-16 sm:h-[88px]';

    // Face-down card (back)
    if (!faceUp || !card) {
        return (
            <div
                className={`
          ${cardSize}
          playing-card playing-card-back
          flex items-center justify-center
          border-2 border-blue-400/30
        `}
            >
                <div className="w-3/4 h-3/4 rounded border-2 border-blue-300/40 flex items-center justify-center">
                    <span className="text-blue-200/60 font-bold text-lg">♠</span>
                </div>
            </div>
        );
    }

    // Face-up card
    const isRed = isRedSuit(card.suit);
    const symbol = SUIT_SYMBOLS[card.suit];

    return (
        <div
            className={`
        ${cardSize}
        playing-card
        bg-white
        flex flex-col
        p-1
        border border-gray-300
        cursor-pointer
        select-none
      `}
        >
            {/* Top-left corner */}
            <div className={`flex flex-col items-start leading-none ${isRed ? 'text-red-500' : 'text-slate-900'}`}>
                <span className="font-bold">{card.rank}</span>
                <span>{symbol}</span>
            </div>

            {/* Center symbol */}
            <div className={`flex-1 flex items-center justify-center ${isRed ? 'text-red-500' : 'text-slate-900'}`}>
                <span className="text-2xl sm:text-3xl">{symbol}</span>
            </div>

            {/* Bottom-right corner (rotated) */}
            <div className={`flex flex-col items-end leading-none rotate-180 ${isRed ? 'text-red-500' : 'text-slate-900'}`}>
                <span className="font-bold">{card.rank}</span>
                <span>{symbol}</span>
            </div>
        </div>
    );
};

export default Card;
