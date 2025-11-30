export const getWatchHistory = (): string[] => {
    const history = localStorage.getItem("watchHistory");
    return history ? JSON.parse(history) : [];
};

export const addToWatchHistory = (id: string) => {
    const history = getWatchHistory();
    history.push(id);
    localStorage.setItem("watchHistory", JSON.stringify(history));
};

export const removeFromWatchHistory = (id: string) => {
    const history = getWatchHistory();
    const updatedHistory = history.filter((item: string) => item !== id);
    if (updatedHistory.length === history.length) {
        return;
    }
    localStorage.setItem("watchHistory", JSON.stringify(updatedHistory));
};

export const clearWatchHistory = () => {
    localStorage.removeItem("watchHistory");
};

export const isWatched = (id: string) => {
    const history = getWatchHistory();
    return history.includes(id);
};
