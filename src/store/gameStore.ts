import { create } from 'zustand';
import { type Card, createDeck, shuffleDeck, dealCards, sortHand } from '../utils/deck';

// Game state types
export type GameState = 'menu' | 'setup' | 'playing';
export type GameType = 'banting' | 'susun' | null;
export type PlayerType = 'human' | 'bot' | 'empty';
export type Difficulty = 'easy' | 'hard';

// Susun container types for drag-and-drop
export type SusunContainerId = 'spare' | 'front' | 'middle' | 'back';

export interface Player {
    id: number;
    name: string;
    type: PlayerType;
    difficulty?: Difficulty;
    position: 'bottom' | 'left' | 'top' | 'right';
}

export interface GameStore {
    // State
    gameState: GameState;
    gameType: GameType;
    players: Player[];
    deck: Card[];
    playerHands: Record<number, Card[]>;

    // Susun-specific state (for human player arrangement)
    susunSpareCards: Card[];
    susunFrontRow: Card[];
    susunMiddleRow: Card[];
    susunBackRow: Card[];

    // Actions
    setGameType: (type: GameType) => void;
    setPlayers: (players: Player[]) => void;
    updatePlayer: (id: number, updates: Partial<Player>) => void;
    startGame: () => void;
    resetGame: () => void;
    initializeSetup: (gameType: GameType) => void;

    // Susun-specific actions
    moveCard: (cardId: string, source: SusunContainerId, target: SusunContainerId, newIndex: number) => void;
}

// Default player configuration
const createDefaultPlayers = (): Player[] => [
    { id: 0, name: 'You', type: 'human', position: 'bottom' },
    { id: 1, name: 'Slot 2', type: 'empty', position: 'left' },
    { id: 2, name: 'Slot 3', type: 'empty', position: 'top' },
    { id: 3, name: 'Slot 4', type: 'empty', position: 'right' },
];

// Max cards per Susun row
const SUSUN_ROW_LIMITS: Record<SusunContainerId, number> = {
    spare: 13,
    front: 3,
    middle: 5,
    back: 5,
};

// Helper to get the array key for a container
const getContainerKey = (containerId: SusunContainerId): keyof Pick<GameStore, 'susunSpareCards' | 'susunFrontRow' | 'susunMiddleRow' | 'susunBackRow'> => {
    switch (containerId) {
        case 'spare': return 'susunSpareCards';
        case 'front': return 'susunFrontRow';
        case 'middle': return 'susunMiddleRow';
        case 'back': return 'susunBackRow';
    }
};

export const useGameStore = create<GameStore>((set, get) => ({
    // Initial state
    gameState: 'menu',
    gameType: null,
    players: createDefaultPlayers(),
    deck: [],
    playerHands: {},

    // Susun-specific initial state
    susunSpareCards: [],
    susunFrontRow: [],
    susunMiddleRow: [],
    susunBackRow: [],

    // Set the game type
    setGameType: (type) => set({ gameType: type }),

    // Set all players
    setPlayers: (players) => set({ players }),

    // Update a single player
    updatePlayer: (id, updates) => set((state) => ({
        players: state.players.map((player) =>
            player.id === id
                ? {
                    ...player,
                    ...updates,
                    // Auto-generate name based on type and difficulty
                    name: updates.type === 'bot'
                        ? `Bot ${id} - ${updates.difficulty || player.difficulty || 'Easy'}`
                        : updates.type === 'empty'
                            ? `Slot ${id + 1}`
                            : player.name,
                }
                : player
        ),
    })),

    // Initialize setup with game type
    initializeSetup: (gameType) => set({
        gameState: 'setup',
        gameType,
        players: createDefaultPlayers(),
        deck: [],
        playerHands: {},
        susunSpareCards: [],
        susunFrontRow: [],
        susunMiddleRow: [],
        susunBackRow: [],
    }),

    // Start the game - shuffle and deal cards
    startGame: () => {
        const { gameType } = get();

        // Create and shuffle deck
        const deck = createDeck();
        const shuffledDeck = shuffleDeck(deck);

        // Deal cards
        const hands = dealCards(shuffledDeck, 4, 13);

        // Sort hands for display
        const sortedHands: Record<number, Card[]> = {};
        for (const [playerId, hand] of Object.entries(hands)) {
            sortedHands[Number(playerId)] = sortHand(hand);
        }

        // For Susun mode, initialize spare cards with human player's hand
        const susunState = gameType === 'susun' ? {
            susunSpareCards: sortedHands[0] || [],
            susunFrontRow: [],
            susunMiddleRow: [],
            susunBackRow: [],
        } : {};

        set({
            gameState: 'playing',
            deck: shuffledDeck,
            playerHands: sortedHands,
            ...susunState,
        });
    },

    // Move card between Susun containers
    moveCard: (cardId, source, target, newIndex) => {
        const state = get();

        // Get source and target arrays
        const sourceKey = getContainerKey(source);
        const targetKey = getContainerKey(target);
        const sourceArray = [...state[sourceKey]];
        const targetArray = source === target ? sourceArray : [...state[targetKey]];

        // Find the card in source
        const cardIndex = sourceArray.findIndex(c => c.id === cardId);
        if (cardIndex === -1) return;

        // Check target capacity (only if moving to different container)
        if (source !== target && targetArray.length >= SUSUN_ROW_LIMITS[target]) {
            return; // Target is full
        }

        // Remove card from source
        const [card] = sourceArray.splice(cardIndex, 1);

        // Add card to target at new index
        if (source === target) {
            // Reordering within same container
            sourceArray.splice(newIndex, 0, card);
            set({ [sourceKey]: sourceArray });
        } else {
            // Moving to different container
            targetArray.splice(newIndex, 0, card);
            set({
                [sourceKey]: sourceArray,
                [targetKey]: targetArray,
            });
        }
    },

    // Reset to menu
    resetGame: () => set({
        gameState: 'menu',
        gameType: null,
        players: createDefaultPlayers(),
        deck: [],
        playerHands: {},
        susunSpareCards: [],
        susunFrontRow: [],
        susunMiddleRow: [],
        susunBackRow: [],
    }),
}));
