import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import {
    MAX_WATCHED_VIDEOS_HISTORY_LENGTH,
    WATCHED_LOCAL_STORAGE_KEY,
} from "./consts";

interface WatchedVideosHistoryContextType {
    watched: string[];
    add: (id: string) => void;
    remove: (id: string) => void;
    clear: () => void;
    isWatched: (id: string) => boolean;
}

const WatchedVideosHistoryContext =
    createContext<WatchedVideosHistoryContextType | null>(null);

export const WatchedVideosHistoryProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const history = localStorage.getItem(WATCHED_LOCAL_STORAGE_KEY);
    const initialHistory = history ? JSON.parse(history) : [];

    const [watched, setWatched] = useState<string[]>(initialHistory);

    useEffect(() => {
        try {
            localStorage.setItem(
                WATCHED_LOCAL_STORAGE_KEY,
                JSON.stringify(watched),
            );
        } catch {
            localStorage.removeItem(WATCHED_LOCAL_STORAGE_KEY);
            setWatched([]);
        }
    }, [watched]);

    const add = (id: string) => {
        const updatedWatched = watched.includes(id)
            ? watched
            : [id, ...watched].slice(0, MAX_WATCHED_VIDEOS_HISTORY_LENGTH);
        setWatched(updatedWatched);
    };

    const remove = (id: string) => {
        setWatched((prev) => prev.filter((item) => item !== id));
    };

    const clear = () => {
        setWatched([]);
    };

    const isWatched = (id: string) => {
        return watched.includes(id);
    };

    return (
        <WatchedVideosHistoryContext.Provider
            value={{
                watched,
                add,
                remove,
                clear,
                isWatched,
            }}
        >
            {children}
        </WatchedVideosHistoryContext.Provider>
    );
};

export function useWatchedVideosHistory() {
    const context = useContext(WatchedVideosHistoryContext);
    if (!context) {
        throw new Error(
            "useWatchedVideosHistory must be used within a WatchedVideosHistoryProvider",
        );
    }
    return context;
}
