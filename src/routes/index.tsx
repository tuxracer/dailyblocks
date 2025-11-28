import { createFileRoute, Navigate } from '@tanstack/react-router'
import { DEFAULT_SUBREDDIT } from '../consts'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Navigate to="/r/$subreddit" params={{ subreddit: DEFAULT_SUBREDDIT }} replace />
}
