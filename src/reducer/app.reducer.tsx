import { IPlayer, AppAction, IPlayingDeck } from 'src/models/app.models';

export interface IAppState {
    playingDeck: IPlayingDeck | null,
    players: IPlayer[],
    currentTurn: number,
    gameMsgBorad: string,
    isGameOver: boolean
};

const reducer = (state: IAppState, action: AppAction) => {
    switch (action.type) {
        case 'add-new-player': {
            if (state.players.find(player => player.id === action.id)) {
                return state;
            }

            const newPlayer: IPlayer = {
                id: action.id,
                PlayerPile: null,
                name: action.name,
                playerCard: null,
                score: 0
            };

            return {
                ...state,
                players: [...state.players, newPlayer],
                currentTurn: state.players.length === 0 ? action.id : state.currentTurn
            };
        }
        case 'update-player-name': {
            return {
                ...state,
                players: state.players.map(player =>
                    player.id === action.id ? { ...player, name: action.name } : player
                )
            };
        }
        case 'update-deck-remaining': {
            return {
                ...state,
                playingDeck: state.playingDeck ? { ...state.playingDeck, remaining: action.remaining } : null
            };
        }
        case 'set-deck': {
            return {
                ...state,
                playingDeck: action.deck
            };
        }
        case 'save-players-card': {
            return {
                ...state,
                players: state.players.map((player, index) => ({
                    ...player,
                    playerCard: action.cards[index]
                }))
            };
        }
        case 'update-round-win': {
            const currentPlayerIndex = state.players.findIndex(player => player.id === state.currentTurn);
            const nextTurn = currentPlayerIndex + 1 === state.players.length ? state.players[0].id : state.players[currentPlayerIndex + 1].id;

            return {
                ...state,
                players: state.players.map(player =>
                    player.id === action.roundWinner.id
                        ? { ...player, score: action.roundWinner.pile.remaining, PlayerPile: action.roundWinner.pile }
                        : player
                ),
                gameMsgBorad: action.roundWinner.message,
                currentTurn: nextTurn
            };
        }
        case 'game-over': {
            return {
                ...state,
                gameMsgBorad: action.winnerName ? `${action.winnerName} won the game!` : "Game ended in a tie!",
                isGameOver: true,
                currentTurn: -1
            };
        }
        case 'restart-game': {
            return {
                playingDeck: action.deck,
                players: state.players.map(player => ({
                    ...player,
                    PlayerPile: null,
                    playerCard: null,
                    score: 0
                })),
                currentTurn: state.players[0]?.id || -1,
                gameMsgBorad: "",
                isGameOver: false
            };
        }
        default:
            throw new Error(`Unknown action type`);
    }
};

export default reducer;