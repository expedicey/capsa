import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type Card as CardType } from '../utils/deck';
import Card from './Card';

interface SortableCardProps {
    card: CardType;
    containerId: string;
}

/**
 * Sortable card wrapper that enables drag-and-drop functionality
 */
export const SortableCard: React.FC<SortableCardProps> = ({ card, containerId }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: card.id,
        data: {
            type: 'card',
            card,
            containerId,
        },
    });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        touchAction: 'none',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`
                ${isDragging ? 'z-50 scale-105' : 'z-0'}
                transition-transform duration-150
            `}
        >
            <Card card={card} faceUp={true} />
        </div>
    );
};

export default SortableCard;
