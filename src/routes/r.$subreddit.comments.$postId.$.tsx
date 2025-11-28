import { createFileRoute, useLocation } from '@tanstack/react-router'
import { usePost } from '../hooks/useRedditPost'
import { useComments } from '../hooks/useRedditComments'
import ReactPlayer from 'react-player'

export const Route = createFileRoute('/r/$subreddit/comments/$postId/$')({
  component: PermalinkPage,
})

function PermalinkPage() {
  const params = Route.useParams()
  const location = useLocation()
  const { subreddit, postId } = params
  
  // Use the full pathname as the permalink (includes the title slug)
  const permalink = location.pathname
  
  const post = usePost(postId, subreddit)
  const comments = useComments(permalink)

  if (post.isLoading) {
    return null
  }

  if (post.error) {
    return <div>Error loading post: {post.error.message}</div>
  }

  if (!post.data) {
    return <div>Post not found</div>
  }

  const postData = post.data

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{postData.title}</h1>
        <div className="text-sm text-gray-600 mb-4">
          <span>r/{postData.subreddit}</span>
          <span className="mx-2">•</span>
          <span>{postData.score} points</span>
          <span className="mx-2">•</span>
          <span>{postData.numComments} comments</span>
        </div>
        
        {postData.isPlayable && postData.mediaUrl && (
          <div className="mb-4">
            <ReactPlayer
              src={postData.mediaUrl}
              controls
              playing={false}
              width="100%"
              height="auto"
            />
          </div>
        )}
        
        {postData.description && (
          <div className="mb-4 text-gray-700">
            {postData.description}
          </div>
        )}
      </div>

      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        {comments.isLoading && <div>Loading comments...</div>}
        {comments.error && (
          <div className="text-red-600">Error loading comments: {comments.error.message}</div>
        )}
        {comments.data && comments.data.length === 0 && (
          <div className="text-gray-500">No comments yet</div>
        )}
        {comments.data && comments.data.length > 0 && (
          <div className="space-y-4">
            {comments.data.map((comment) => (
              <div key={comment.id} className="border-l-2 border-gray-200 pl-4">
                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold">{comment.author}</span>
                  {comment.numReplies > 0 && (
                    <span className="ml-2">({comment.numReplies} replies)</span>
                  )}
                </div>
                <div
                  className="text-gray-800"
                  dangerouslySetInnerHTML={{ __html: comment.bodyHtml }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
