import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { type Card as CardType } from '../utils/deck';
import { type SusunContainerId } from '../store/gameStore';
import SortableCard from './SortableCard';

interface DropZoneProps {
    id: SusunContainerId;
    label: string;
    maxCards: number;
    cards: CardType[];
    isSpare?: boolean;
}

/**
 * Droppable zone for Susun card arrangement
 */
export const DropZone: React.FC<DropZoneProps> = ({
    id,
    label,
    maxCards,
    cards,
    isSpare = false,
}) => {
    const { setNodeRef, isOver } = useDroppable({
        id,
        data: {
            type: 'container',
            containerId: id,
        },
    });

    const emptySlots = Math.max(0, maxCards - cards.length);
    const isFull = cards.length >= maxCards;

    return (
        <div
            ref={setNodeRef}
            className={`
                rounded-xl p-3 transition-all duration-200
                ${isSpare
                    ? 'bg-slate-700/40 border border-slate-600/30'
                    : 'bg-slate-800/60 border-2 border-dashed'
                }
                ${isOver && !isFull
                    ? 'border-emerald-400 bg-emerald-500/10 shadow-lg shadow-emerald-500/20'
                    : isSpare
                        ? 'border-slate-600/30'
                        : 'border-slate-500/50'
                }
                ${isFull && !isSpare ? 'border-amber-500/50' : ''}
            `}
        >
            {/* Row Label */}
            <div className="flex items-center justify-between mb-2">
                <span className={`
                    text-xs font-semibold uppercase tracking-wide
                    ${isSpare ? 'text-slate-400' : 'text-slate-300'}
                `}>
                    {label}
                </span>
                <span className={`
                    text-xs px-2 py-0.5 rounded-full
                    ${isFull
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-600/50 text-slate-400'
                    }
                `}>
                    {cards.length}/{maxCards}
                </span>
            </div>

            {/* Cards Container */}
            <SortableContext
                items={cards.map(c => c.id)}
                strategy={horizontalListSortingStrategy}
            >
                <div className={`
                    flex items-center gap-1 min-h-[88px]
                    ${isSpare ? 'flex-wrap justify-center gap-y-2' : 'justify-center'}
                `}>
                    {/* Render placed cards */}
                    {cards.map((card) => (
                        <SortableCard
                            key={card.id}
                            card={card}
                            containerId={id}
                        />
                    ))}

                    {/* Render empty slot indicators (only for row zones, not spare) */}
                    {!isSpare && emptySlots > 0 && (
                        Array.from({ length: emptySlots }).map((_, index) => (
                            <div
                                key={`empty-${index}`}
                                className={`
                                    w-14 h-20 sm:w-16 sm:h-[88px]
                                    rounded-lg border-2 border-dashed
                                    flex items-center justify-center
                                    transition-colors duration-200
                                    ${isOver
                                        ? 'border-emerald-400/60 bg-emerald-500/5'
                                        : 'border-slate-500/30 bg-slate-700/20'
                                    }
                                `}
                            >
                                <span className="text-slate-500/50 text-2xl">+</span>
                            </div>
                        ))
                    )}

                    {/* Empty state for spare zone */}
                    {isSpare && cards.length === 0 && (
                        <div className="text-slate-500 text-sm italic py-4">
                            All cards placed
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
};

export default DropZone;
