import { useEffect, useState } from 'react';
import { useAppContext, useAppDispatchContext } from 'src/context/appContext';
import { calculateRoundWinner, calculateWinnerName, draw2CardsFromDeck, getNewDeck } from 'src/app.service';
import styled from 'styled-components';

const Table = styled.div`
    background-color: lightgreen;
    background-size: cover;
    background-repeat: no-repeat;
    width: 40vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 25px;
    text-align: center;
    padding: 15px;
    border-radius: 15px;
`;

const Deck = styled.div`
    width: 144px;
    height: 200px;
    background-image: url("https://deckofcardsapi.com/static/img/back.png");
    background-size: cover;
    background-repeat: no-repeat;

    &.player {
        background-size: cover;
        background-repeat: no-repeat;
    }
`;

const PlayersDeck = styled.div`
    display: flex;
    gap: 25px;
`;

const PlayingTable = () => {
    const state = useAppContext();
    const dispatch = useAppDispatchContext();
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const fetchNewDeck = async () => {
            const deck = await getNewDeck();
            dispatch({ type: 'set-deck', deck });
        };
        fetchNewDeck();

        return () => { };
    }, []);

    useEffect(() => {
        if (state?.isGameOver) {
            const winnerName = calculateWinnerName(state?.players || []);
            dispatch({ type: 'announce-winner', winnerName });
        }
    }, [state?.isGameOver]);

    const drawClicked = async () => {
        if (isDrawing) return;
        setIsDrawing(true);

        if (state && state.playingDeck) {
            const drawnCards = await draw2CardsFromDeck(state.playingDeck.deck_id);
            dispatch({ type: 'save-players-card', cards: drawnCards.cards });

            const roundWinner = await calculateRoundWinner(state.players, drawnCards.cards, state.playingDeck.deck_id);
            dispatch({ type: 'update-round-win', roundWinner });

            if (!drawnCards.remaining) {
                dispatch({ type: 'game-over' });
            }
        }
        setIsDrawing(false);
    };

    const restartGameClicked = async () => {
        const newDeck = await getNewDeck();
        dispatch({ type: 'restart-game', deck: newDeck });
    }

    return (
        <Table>
            <Deck className='main' style={{ visibility: state?.isGameOver ? 'hidden' : 'visible' }}></Deck>
            <PlayersDeck>
                <Deck className='player' style={{ backgroundImage: `url(${state?.players[0]?.playerCard?.image})` }}></Deck>
                <Deck className='player' style={{ backgroundImage: `url(${state?.players[1]?.playerCard?.image})` }}></Deck>
            </PlayersDeck>
            <div>
                <span>Current turn: {state?.players.find(player => player.id === state?.currentTurn)?.name}</span>
                <h2>{state?.gameMsgBorad || "-"}</h2>
            </div>
            <button onClick={drawClicked} disabled={isDrawing || state?.isGameOver}>Draw</button>
            <button onClick={restartGameClicked} style={{ display: state?.isGameOver ? 'block' : 'none' }}>Restart Game</button>
        </Table>
    );
};

export default PlayingTable;