import { createRootRoute, Outlet } from "@tanstack/react-router";

const NotFoundComponent: React.FC = () => {
    return (
        <div className="w-full h-screen flex items-center justify-center">
            No videos found ❌
        </div>
    );
};

export const Route = createRootRoute({
    component: () => <Outlet />,
    notFoundComponent: NotFoundComponent,
});
