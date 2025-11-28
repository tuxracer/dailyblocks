import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useSubreddit } from '../hooks/useSubreddit'

export const Route = createFileRoute('/r/$subreddit/')({
  component: SubredditPage,
})

function SubredditPage() {
  const params = Route.useParams()
  const subreddit = useSubreddit({ subreddit: params.subreddit })
  const firstPostPermalink = subreddit.data?.[0]?.permalink

  if (subreddit.isLoading) {
    return null
  }

  if (!firstPostPermalink) {
    return "No videos found for this subreddit"
  }

  return <Navigate to={firstPostPermalink} replace />
}
