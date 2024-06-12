import { memo, useEffect } from 'react';
import { useAppContext, useAppDispatchContext } from 'src/context/appContext';

const Player = ({ name, id }: { name: string, id: number }) => {
    const state = useAppContext();
    const dispatch = useAppDispatchContext();

    useEffect(() => {
        dispatch({ type: 'add-new-player', id, name });
    }, []);

    useEffect(() => {
        dispatch({ type: 'update-player-name', id, name });
    }, [name]);

    return (
        <div>
            <div><span>Player name: {name}</span></div>
            <div><span>Player score: {state?.players?.find(p => p.id == id)?.score}</span></div>
        </div>
    )
}

export default memo(Player);