import { IPlayer, IPlayingDeck } from 'src/models/app.models';

export interface IAppState {
    playingDeck: IPlayingDeck | null,
    players: IPlayer[],
    currentTurn: number,
    gameMsgBorad: string,
    isGameOver: boolean
};

const reducer = (state: IAppState, action: any) => {
    switch (action.type) {
        case 'add-new-player':
            if (state.players.findIndex(player => player.id === action.id) !== -1) {
                return { ...state };
            }

            const newPlayer: IPlayer = {
                id: action.id,
                PlayerPile: null,
                name: action.name,
                playerCard: null,
                score: 0
            };

            if (!state.players.length) {
                return {
                    ...state,
                    currentTurn: action.id,
                    players: [...state.players, newPlayer]
                }
            } else {
                return {
                    ...state,
                    players: [...state.players, newPlayer]
                }
            }
        case 'update-player-name':
            return {
                ...state,
                players: state.players.map(player => {
                    if (player.id === action.id) {
                        player.name = action.name;
                    }
                    return player;
                })
            }
        case 'update-deck-remaining':
            return {
                ...state,
                playingDeck: { ...state.playingDeck, remaining: action.remaining }
            }
        case 'set-deck':
            return {
                ...state,
                playingDeck: action.deck
            }
        case 'save-players-card':
            return {
                ...state,
                players: state.players.map((player, index) => {
                    return {
                        ...player,
                        playerCard: action.cards[index]
                    }
                })
            }
        case 'update-round-win':
            let currentPlayerIndex = state.players.findIndex(player => player.id === state.currentTurn);
            return {
                ...state,
                players: state.players.map(player => {
                    if (player.id === action.roundWinner.id) {
                        player.score = parseInt(action.roundWinner.pile.remaining);
                        player.PlayerPile = action.roundWinner.pile;
                    }

                    return player;
                }),
                gameMsgBorad: action.roundWinner.message,
                currentTurn: currentPlayerIndex + 1 === state.players.length ?
                    state.players[0].id :
                    state.players[++currentPlayerIndex].id
            }
        case 'game-over':
            return {
                ...state,
                gameMsgBorad: action.winnerName ? `${action.winnerName} won the game!` : "Game ended in a tie!",
                isGameOver: true,
                currentTurn: -1
            }
        case 'restart-game':
            return {
                playingDeck: action.deck,
                players: state.players.map(player => {
                    player.PlayerPile = null;
                    player.playerCard = null;
                    player.score = 0;

                    return player;
                }),
                currentTurn: state.players[0].id,
                gameMsgBorad: "",
                isGameOver: false
            }
        default:
            throw Error(`unknown action ${action.type}`)
    }
}

export default reducer;