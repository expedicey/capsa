// Card Types and Utilities for Capsa

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
    id: string;
    suit: Suit;
    rank: Rank;
}

export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
export const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Suit symbols for display
export const SUIT_SYMBOLS: Record<Suit, string> = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠',
};

// Check if suit is red
export const isRedSuit = (suit: Suit): boolean => {
    return suit === 'hearts' || suit === 'diamonds';
};

/**
 * Creates a standard 52-card deck
 */
export const createDeck = (): Card[] => {
    const deck: Card[] = [];

    for (const suit of SUITS) {
        for (const rank of RANKS) {
            deck.push({
                id: `${rank}-${suit}`,
                suit,
                rank,
            });
        }
    }

    return deck;
};

/**
 * Fisher-Yates shuffle algorithm
 */
export const shuffleDeck = (deck: Card[]): Card[] => {
    const shuffled = [...deck];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
};

/**
 * Deals cards to a specified number of players
 * @param deck - The shuffled deck to deal from
 * @param numPlayers - Number of players (default 4)
 * @param cardsPerPlayer - Cards per player (default 13 for Capsa)
 * @returns Object mapping player index to their hand
 */
export const dealCards = (
    deck: Card[],
    numPlayers: number = 4,
    cardsPerPlayer: number = 13
): Record<number, Card[]> => {
    const hands: Record<number, Card[]> = {};

    // Initialize empty hands
    for (let i = 0; i < numPlayers; i++) {
        hands[i] = [];
    }

    // Deal cards round-robin style
    let cardIndex = 0;
    for (let round = 0; round < cardsPerPlayer; round++) {
        for (let player = 0; player < numPlayers; player++) {
            if (cardIndex < deck.length) {
                hands[player].push(deck[cardIndex]);
                cardIndex++;
            }
        }
    }

    return hands;
};

/**
 * Sorts a hand of cards by rank (high to low) for display
 */
export const sortHand = (hand: Card[]): Card[] => {
    const rankOrder: Record<Rank, number> = {
        'A': 14, 'K': 13, 'Q': 12, 'J': 11, '10': 10,
        '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2
    };

    return [...hand].sort((a, b) => {
        const rankDiff = rankOrder[b.rank] - rankOrder[a.rank];
        if (rankDiff !== 0) return rankDiff;
        // Secondary sort by suit
        return SUITS.indexOf(a.suit) - SUITS.indexOf(b.suit);
    });
};
