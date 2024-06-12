import { createContext, useContext } from 'react';
import { IAppState } from 'src/reducer/app.reducer';

export const AppContext = createContext<IAppState | null>(null);
export const AppDispatchContext = createContext<any>(null);

export const useAppContext = () => (useContext(AppContext));
export const useAppDispatchContext = () => (useContext(AppDispatchContext));