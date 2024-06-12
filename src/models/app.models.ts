export interface IPlayingDeck {
    success: boolean,
    deck_id: string,
    shuffled: boolean,
    remaining: number
}

export interface IPlayer {
    name: string,
    id: number,
    playerCard: IPlayingCard | null,
    PlayerPile: IPlayerPile | null,
    score: number
}

export type PlayerTurn = "Player1" | "Player2";

export interface IPlayingCard {
    code: string,
    image: string,
    value: string,
    suit: string
}

export interface IPlayerPile {
    deck_id: string,
    cards: IPlayingCard[],
    remaining: number
}

export interface IRoundWinner {
    id: number,
    message: string,
    pile: IPlayerPile | null
}
