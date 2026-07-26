import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { WatchedVideosHistoryProvider } from "../contexts/WatchedVideosHistoryContext";
import { SWRConfig } from "swr";

const NotFoundComponent: React.FC = () => {
    return (
        <div className="w-full h-screen flex items-center justify-center">
            No videos found ❌
        </div>
    );
};

export const Route = createRootRoute({
    component: () => (
        <>
            <HeadContent />
            <SWRConfig
                value={{ revalidateOnFocus: false, revalidateIfStale: false }}
            >
                <WatchedVideosHistoryProvider>
                    <Outlet />
                </WatchedVideosHistoryProvider>
            </SWRConfig>
        </>
    ),
    notFoundComponent: NotFoundComponent,
});
