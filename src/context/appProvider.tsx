import { ReactNode, useMemo, useReducer } from 'react';
import appReducer, { IAppState } from 'src/reducer/app.reducer';
import { AppContext, AppDispatchContext } from './appContext';

type Props = { children: ReactNode }

const initialState: IAppState = {
    playingDeck: null,
    players: [],
    currentTurn: -1,
    gameMsgBorad: "",
    isGameOver: false
}

const AppProvider = ({ children }: Props) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    const memorizedContext = useMemo(() => ({ state, dispatch }), [state, dispatch]);

    return (
        <AppContext.Provider value={memorizedContext.state}>
            <AppDispatchContext.Provider value={memorizedContext.dispatch}>
                {children}
            </AppDispatchContext.Provider>
        </AppContext.Provider >
    )
}

export default AppProvider;