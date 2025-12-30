import React, { useCallback } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useGameStore, type SusunContainerId } from '../store/gameStore';
import { type Card as CardType } from '../utils/deck';
import DropZone from './DropZone';
import Card from './Card';

/**
 * Human player area for Capsa Susun with drag-and-drop card arrangement
 */
export const HumanPlayerArea: React.FC = () => {
    const {
        susunSpareCards,
        susunFrontRow,
        susunMiddleRow,
        susunBackRow,
        moveCard,
    } = useGameStore();

    const [activeCard, setActiveCard] = React.useState<CardType | null>(null);

    // Configure drag sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    // Get container by ID
    const getContainerCards = useCallback((containerId: SusunContainerId): CardType[] => {
        switch (containerId) {
            case 'spare': return susunSpareCards;
            case 'front': return susunFrontRow;
            case 'middle': return susunMiddleRow;
            case 'back': return susunBackRow;
        }
    }, [susunSpareCards, susunFrontRow, susunMiddleRow, susunBackRow]);

    // Find which container a card is in
    const findContainer = useCallback((cardId: string): SusunContainerId | null => {
        if (susunSpareCards.find(c => c.id === cardId)) return 'spare';
        if (susunFrontRow.find(c => c.id === cardId)) return 'front';
        if (susunMiddleRow.find(c => c.id === cardId)) return 'middle';
        if (susunBackRow.find(c => c.id === cardId)) return 'back';
        return null;
    }, [susunSpareCards, susunFrontRow, susunMiddleRow, susunBackRow]);

    // Handle drag start
    const handleDragStart = useCallback((event: DragStartEvent) => {
        const { active } = event;
        const containerId = findContainer(active.id as string);
        if (containerId) {
            const cards = getContainerCards(containerId);
            const card = cards.find(c => c.id === active.id);
            if (card) {
                setActiveCard(card);
            }
        }
    }, [findContainer, getContainerCards]);

    // Handle drag end
    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        setActiveCard(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        // Find source container
        const sourceContainer = findContainer(activeId);
        if (!sourceContainer) return;

        // Determine target container
        let targetContainer: SusunContainerId;
        let targetIndex = 0;

        // Check if dropped on a container directly
        if (['spare', 'front', 'middle', 'back'].includes(overId)) {
            targetContainer = overId as SusunContainerId;
            targetIndex = getContainerCards(targetContainer).length;
        } else {
            // Dropped on another card - find its container
            const overContainer = findContainer(overId);
            if (!overContainer) return;
            targetContainer = overContainer;

            const targetCards = getContainerCards(targetContainer);
            targetIndex = targetCards.findIndex(c => c.id === overId);
            if (targetIndex === -1) targetIndex = targetCards.length;
        }

        // Move the card
        if (sourceContainer === targetContainer) {
            // Reordering within same container
            const sourceCards = getContainerCards(sourceContainer);
            const oldIndex = sourceCards.findIndex(c => c.id === activeId);
            if (oldIndex !== targetIndex && oldIndex !== -1) {
                moveCard(activeId, sourceContainer, targetContainer, targetIndex);
            }
        } else {
            // Moving to different container
            moveCard(activeId, sourceContainer, targetContainer, targetIndex);
        }
    }, [findContainer, getContainerCards, moveCard]);

    const totalPlaced = susunFrontRow.length + susunMiddleRow.length + susunBackRow.length;
    const isComplete = totalPlaced === 13;

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-xl">
                        🎮
                    </div>
                    <div>
                        <h3 className="font-semibold text-white text-sm">You</h3>
                        <span className="text-xs text-slate-400">Arrange your cards</span>
                    </div>
                </div>
                <div className={`
                    text-xs px-3 py-1 rounded-full
                    ${isComplete
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-600/50 text-slate-400'
                    }
                `}>
                    {totalPlaced}/13 cards placed
                </div>
            </div>

            {/* Drag and Drop Context */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="space-y-3">
                    {/* Front Row (3 cards) */}
                    <DropZone
                        id="front"
                        label="Front Hand (3)"
                        maxCards={3}
                        cards={susunFrontRow}
                    />

                    {/* Middle Row (5 cards) */}
                    <DropZone
                        id="middle"
                        label="Middle Hand (5)"
                        maxCards={5}
                        cards={susunMiddleRow}
                    />

                    {/* Back Row (5 cards) */}
                    <DropZone
                        id="back"
                        label="Back Hand (5)"
                        maxCards={5}
                        cards={susunBackRow}
                    />

                    {/* Spare Cards */}
                    <DropZone
                        id="spare"
                        label="Spare Cards"
                        maxCards={13}
                        cards={susunSpareCards}
                        isSpare
                    />
                </div>

                {/* Drag Overlay */}
                <DragOverlay>
                    {activeCard ? (
                        <div className="opacity-90 scale-110">
                            <Card card={activeCard} faceUp={true} />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* Instructions */}
            <div className="mt-4 text-center text-xs text-slate-500">
                Drag cards from spare to arrange into Front, Middle, and Back hands
            </div>
        </div>
    );
};

export default HumanPlayerArea;
