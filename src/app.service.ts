import { IPlayer, IPlayingCard, IRoundWinner } from "./models/app.models";

export const getNewDeck = async () => {
    return fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1",
        { method: 'get' }
    )
        .then((res: Response) => res.json())
        .then((data: any) => {
            if (data.success) {
                return data;
            }
        })
        .catch((error: Error) => {
            console.log(error);
        });
};

export const addToPile = async (deckId: string, pileName: string, cards: string) => {
    return fetch(`https://deckofcardsapi.com/api/deck/${deckId}/pile/${pileName}/add/?cards=${cards}`,
        { method: 'get' }
    )
        .then((res: Response) => res.json())
        .then((data: any) => {
            if (data.success) {
                return data;
            }
        })
        .catch((error: Error) => {
            console.log(error);
        });
};

export const shuffleDeck = async (deckId: string) => {
    return fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/?remaining=true`,
        { method: 'get' }
    )
        .then((res: Response) => res.json())
        .then((data: any) => {
            if (data.success) {
                return data;
            }
        })
        .catch((error: Error) => {
            console.log(error);
        });
};

export const draw2CardsFromDeck = async (deckId: string) => {
    return fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`,
        { method: 'get' }
    )
        .then((res: Response) => res.json())
        .then((data: any) => {
            if (data.success) {
                return data;
            }
        })
        .catch((error: Error) => {
            console.log(error);
        });
};

export const returnCardsToDeck = async (deckId: string) => {
    return fetch(`https://deckofcardsapi.com/api/deck/${deckId}/return/`,
        { method: 'get' }
    )
        .then((res: Response) => res.json())
        .then((data: any) => {
            if (data.success) {
                return data;
            }
        })
        .catch((error: Error) => {
            console.log(error);
        });
};

export const listPiles = async (deckId: string, pileName: string) => {
    return fetch(`https://deckofcardsapi.com/api/deck/${deckId}/pile/${pileName}/list/`,
        { method: 'get' }
    )
        .then((res: Response) => res.json())
        .then((data: any) => {
            if (data.success) {
                return data;
            }
        })
        .catch((error: Error) => {
            console.log(error);
        });
};

export const calculateWinnerName = (players: IPlayer[]) => {
    debugger
    console.log("calculateWinnerName");
    const maxScore = Math.max(...players.map(item => item.score));
    console.log(`Max score is ${maxScore}`);
    const winner = players.filter(item => item.score === maxScore);
    console.log(`Winner is ${JSON.stringify(winner)}`);

    if (winner.length === 1) {
        return winner[0].name;
    } else {
        return null;
    }
}

export const calculateRoundWinner = async (players: IPlayer[], cards: IPlayingCard[], deckId: string): Promise<IRoundWinner> => {
    const cardsValues = cards.map(card => (getCardValue(card)));
    let roundWinner: IRoundWinner = { id: -1, message: "", pile: null };

    switch (true) {
        case cardsValues[0] > cardsValues[1]:
            const player1Name = players[0].name;
            const player1Pile = await addToPile(
                deckId,
                player1Name,
                cards[0].code.concat(",", cards[1].code));

            if (player1Pile) {
                roundWinner = {
                    id: players[0].id,
                    pile: player1Pile.piles[player1Name],
                    message: `${player1Name} wins round!`
                };
            } else
                throw Error("Error adding cards to players pile.")
            break;
        case cardsValues[0] < cardsValues[1]:
            const player2Name = players[1].name;
            const player2Pile = await addToPile(
                deckId,
                player2Name,
                cards[0].code.concat(",", cards[1].code));
            if (player2Pile) {
                roundWinner = {
                    id: players[1].id,
                    pile: player2Pile.piles[player2Name],
                    message: `${player2Name} wins round!`
                };
            } else
                throw Error("Error adding cards to players pile.")
            break;
        case cardsValues[0] === cardsValues[1]:
            roundWinner = {
                ...roundWinner,
                message: `Round end up in a tie!`
            };
            // TODO: Check if only 2 cards in deck, if so, end game.
            const res = await returnCardsToDeck(deckId);
            if (res) {
                shuffleDeck(deckId);
            }
            break;
    }

    return roundWinner;
};

export const getCardValue = (card: IPlayingCard) => {
    if (!isNaN(card.value as any))
        return parseInt(card.value);
    else
        switch (card.value) {
            case "JACK":
                return 11;
            case "QUEEN":
                return 12;
            case "KING":
                return 13
            case "ACE":
                return 14;
            default:
                throw Error("Error parsing card value.")
        }
};
