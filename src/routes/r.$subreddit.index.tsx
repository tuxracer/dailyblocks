import { createFileRoute } from '@tanstack/react-router'
import { useSubreddit } from '../hooks/useSubreddit'

export const Route = createFileRoute('/r/$subreddit/')({
  component: SubredditPage,
})

function SubredditPage() {
  const params = Route.useParams()
  const subreddit = useSubreddit({ subreddit: params.subreddit })

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">r/{params.subreddit}</h2>
      {subreddit.isLoading && <p>Loading...</p>}
      {subreddit.error && <p>Error: {subreddit.error.message}</p>}
      <ul>
        {subreddit.data?.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  )
}
