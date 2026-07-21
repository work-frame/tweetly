import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Comment } from '../types/Comment'
import { commentService } from '../services/commentService'
import { Avatar } from './Avatar'
import { useAuth } from '../context/AuthContext'

interface CommentSectionProps {
  tweetId: string
}

const POLL_INTERVAL_MS = 10000

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'now'
  if (diffMins < 60) return `${diffMins}m`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 7) return `${diffDays}d`
  return date.toLocaleDateString()
}

export function CommentSection({ tweetId }: CommentSectionProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    loadComments()
    const interval = setInterval(() => {
      loadComments(true)
    }, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [tweetId])

  async function loadComments(isBackground = false) {
    if (!isBackground) setLoading(true)
    try {
      const data = await commentService.getCommentsByTweet(tweetId)
      setComments(data)
    } catch {
      if (!isBackground) setComments([])
    }
    if (!isBackground) setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newComment.trim()) return

    setPosting(true)
    try {
      await commentService.createComment(tweetId, newComment.trim())
      setNewComment('')
      await loadComments()
    } catch {
      // silently fail for now, could add error state
    }
    setPosting(false)
  }

  async function handleDelete(commentId: string) {
    await commentService.deleteComment(commentId)
    setComments((prev) => prev.filter((c) => c.id !== commentId))
  }

  return (
    <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-900 dark:bg-gray-950">
      {user && (
        <form onSubmit={handleSubmit} className="mb-3 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm text-black focus:border-black focus:outline-none dark:border-gray-700 dark:bg-black dark:text-white dark:focus:border-white"
          />
          <button
            type="submit"
            disabled={posting || !newComment.trim()}
            className="rounded-full bg-black px-3 py-1.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            {posting ? '...' : 'Reply'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-sm text-gray-400 dark:text-gray-500">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-sm text-gray-400 dark:text-gray-500">No comments yet.</div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-2">
              <Link to={`/profile/${comment.author.username}`}>
                <Avatar
                  src={comment.author.avatarUrl}
                  alt={comment.author.displayName}
                  className="h-7 w-7"
                />
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 text-sm">
                  <Link
                    to={`/profile/${comment.author.username}`}
                    className="font-semibold text-black hover:underline dark:text-white"
                  >
                    {comment.author.displayName}
                  </Link>
                  <span className="text-gray-400 dark:text-gray-600">
                    {formatTimestamp(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-900 dark:text-gray-100">{comment.content}</p>
                {user?.id === comment.authorId && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="mt-0.5 text-xs text-gray-400 hover:text-red-500 dark:text-gray-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}