import { FunctionalComponent, h, createContext } from "preact";
import { useAppState } from "../../hooks/useAppState";

type AppStateContextProps = ReturnType<typeof useAppState> | null;

export const AppStateContext = createContext<AppStateContextProps>(null);

interface AppStateContextProviderProps {
    subreddit: string;
    activePostId?: string;
}

export const AppStateContextProvider: FunctionalComponent<AppStateContextProviderProps> = props => (
    <AppStateContext.Provider value={useAppState(props.subreddit)}>
        {props.children}
    </AppStateContext.Provider>
);
