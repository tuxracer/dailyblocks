import { createRootRoute, HeadContent, Outlet } from "@tanstack/react-router";
import { WatchedVideosHistoryProvider } from "../contexts/WatchedVideosHistoryContext";
import { SWRConfig } from "swr";

const NotFoundComponent: React.FC = () => {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-4 p-4 text-center">
            <div>No videos found</div>
            <div className="max-w-prose text-sm text-gray-500">
                ⚠️ Deprecated. Reddit now returns HTTP 403 for all requests.
                This project depended on Reddit allowing unauthenticated
                requests from arbitrary hosts, which is no longer the case.
            </div>
            <a
                className="text-sm text-blue-500 underline"
                href="https://github.com/tuxracer/dailyblocks"
                target="_blank"
                rel="noreferrer"
            >
                View the source code on GitHub
            </a>
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
