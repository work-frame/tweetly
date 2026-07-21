import { useEffect, useState } from 'react'
import { tweetService } from '../services/tweetService'
import type { FeedTweet } from '../services/tweetService'
import { useAuth } from '../context/AuthContext'
import { Composer } from '../components/Composer'
import { TweetCard } from '../components/TweetCard'

const PAGE_SIZE = 3

export function Feed() {
  const { user } = useAuth()
  const [tweets, setTweets] = useState<FeedTweet[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    loadFeed()
  }, [])

  async function loadFeed() {
    setLoading(true)
    const data = await tweetService.getFeed()
    setTweets(data)
    setVisibleCount(PAGE_SIZE)
    setLoading(false)
  }

  async function handlePostTweet(content: string, imageUrl?: string) {
    if (!user) return
    await tweetService.createTweet(content, imageUrl)
    await loadFeed()
  }

  async function handleToggleLike(tweetId: string) {
    await tweetService.toggleLike(tweetId)
    setTweets((prev) =>
      prev.map((tweet) =>
        tweet.id === tweetId
          ? {
              ...tweet,
              likedByCurrentUser: !tweet.likedByCurrentUser,
              likesCount: tweet.likedByCurrentUser
                ? tweet.likesCount - 1
                : tweet.likesCount + 1,
            }
          : tweet
      )
    )
  }

  async function handleDelete(tweetId: string) {
    await tweetService.deleteTweet(tweetId)
    setTweets((prev) => prev.filter((tweet) => tweet.id !== tweetId))
  }

  function handleLoadMore() {
    setVisibleCount((prev) => prev + PAGE_SIZE)
  }

  const visibleTweets = tweets.slice(0, visibleCount)
  const hasMore = visibleCount < tweets.length

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
      <Composer onSubmit={handlePostTweet} />

      {loading ? (
        <div className="p-8 text-center text-gray-400 dark:text-gray-500">Loading feed...</div>
      ) : tweets.length === 0 ? (
        <div className="p-8 text-center text-gray-400 dark:text-gray-500">
          No tweets yet. Be the first to post!
        </div>
      ) : (
        <>
          {visibleTweets.map((tweet) => (
            <TweetCard
              key={tweet.id}
              tweet={tweet}
              author={tweet.author}
              currentUserId={user?.id ?? ''}
              onToggleLike={handleToggleLike}
              onDelete={handleDelete}
            />
          ))}

          {hasMore && (
            <div className="p-4 text-center">
              <button
                onClick={handleLoadMore}
                className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-semibold text-black hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900"
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}