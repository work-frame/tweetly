  import { useEffect, useState } from 'react'
import type { Tweet } from '../types/Tweet'
import { tweetService } from '../services/tweetService'
import { loadUsers } from '../mocks/usersStore'
import { useAuth } from '../context/AuthContext'
import { Composer } from '../components/Composer'
import { TweetCard } from '../components/TweetCard'

const PAGE_SIZE = 3

export function Feed() {
  const { user } = useAuth()
  const [tweets, setTweets] = useState<Tweet[]>([])
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

  async function handlePostTweet(content: string) {
    if (!user) return
    await tweetService.createTweet(content, user.id)
    await loadFeed()
  }

  async function handleToggleLike(tweetId: string) {
    await tweetService.toggleLike(tweetId)
    // refresh data without resetting how many tweets are visible
    const data = await tweetService.getFeed()
    setTweets(data)
  }

  async function handleDelete(tweetId: string) {
    await tweetService.deleteTweet(tweetId)
    const data = await tweetService.getFeed()
    setTweets(data)
  }

  function findAuthor(authorId: string) {
    if (user && user.id === authorId) return user
    return loadUsers().find((u) => u.id === authorId)
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
              author={findAuthor(tweet.authorId)}
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