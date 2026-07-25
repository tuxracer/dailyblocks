import {
    createRootRoute,
    HeadContent,
    Outlet,
    type NotFoundRouteProps,
} from "@tanstack/react-router";
import { WatchedVideosHistoryProvider } from "../contexts/WatchedVideosHistoryContext";
import { SWRConfig } from "swr";
import { NotFound, type NotFoundData } from "../components/NotFound";

const NotFoundComponent: React.FC<NotFoundRouteProps> = (props) => {
    const data = props.data as NotFoundData | undefined;

    return <NotFound subreddit={data?.subreddit} />;
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
