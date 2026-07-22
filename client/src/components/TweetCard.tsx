import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Tweet } from '../types/Tweet'
import type { User } from '../types/User'
import { Avatar } from './Avatar'
import { CommentSection } from './CommentSection'

interface TweetCardProps {
  tweet: Tweet
  author: Pick<User, 'username' | 'displayName' | 'avatarUrl'> | undefined
  currentUserId: string
  onToggleLike: (tweetId: string) => void
  onDelete: (tweetId: string) => void
}

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

export function TweetCard({
  tweet,
  author,
  currentUserId,
  onToggleLike,
  onDelete,
}: TweetCardProps) {
  const isOwner = tweet.authorId === currentUserId
  const [showComments, setShowComments] = useState(false)

  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <div className="p-3 hover:bg-gray-50 sm:p-4 dark:hover:bg-gray-900">
        <div className="flex gap-2 sm:gap-3">
          <Link to={`/profile/${author?.username ?? ''}`} className="shrink-0">
            <Avatar src={author?.avatarUrl ?? ''} alt={author?.displayName ?? 'User'} className="h-9 w-9 hover:opacity-80 sm:h-10 sm:w-10" />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <Link
                to={`/profile/${author?.username ?? ''}`}
                className="truncate font-semibold text-black hover:underline dark:text-white"
              >
                {author?.displayName ?? 'Unknown user'}
              </Link>
              <Link
                to={`/profile/${author?.username ?? ''}`}
                className="truncate text-sm text-gray-500 hover:underline dark:text-gray-400"
              >
                @{author?.username ?? 'unknown'}
              </Link>
              <span className="hidden text-sm text-gray-400 sm:inline dark:text-gray-600">·</span>
              <span className="text-sm text-gray-400 dark:text-gray-600">{formatTimestamp(tweet.createdAt)}</span>
            </div>

            {tweet.content && (
              <p className="mt-1 whitespace-pre-wrap break-words text-gray-900 dark:text-gray-100">{tweet.content}</p>
            )}

            {tweet.imageUrl && (
              <img
                src={tweet.imageUrl}
                alt="Tweet attachment"
                className="mt-2 max-h-72 w-full rounded-xl border border-gray-200 object-cover sm:max-h-96 dark:border-gray-800"
              />
            )}

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-x-4">
              <button
                onClick={() => onToggleLike(tweet.id)}
                className={`flex items-center gap-1 text-sm ${
                  tweet.likedByCurrentUser
                    ? 'text-red-500'
                    : 'text-gray-500 hover:text-red-500 dark:text-gray-400'
                }`}
              >
                {tweet.likedByCurrentUser ? '❤️' : '🤍'} {tweet.likesCount}
              </button>

              <button
                onClick={() => setShowComments((prev) => !prev)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500 dark:text-gray-400"
              >
                💬 <span className="hidden sm:inline">{showComments ? 'Hide comments' : 'Comments'}</span>
              </button>

              <span className="flex items-center gap-1 text-sm text-gray-400 dark:text-gray-600">
                👁️ {tweet.viewsCount}
              </span>

              {isOwner && (
                <button
                  onClick={() => onDelete(tweet.id)}
                  className="text-sm text-gray-500 hover:text-red-500 dark:text-gray-400"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showComments && <CommentSection tweetId={tweet.id} />}
    </div>
  )
}