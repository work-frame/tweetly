import type { Tweet } from '../types/Tweet'
import { mockTweets } from '../mocks/tweets'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const TWEETS_STORAGE_KEY = 'tweetly_tweets_db'

function loadTweets(): Tweet[] {
  const stored = localStorage.getItem(TWEETS_STORAGE_KEY)
  if (stored) return JSON.parse(stored)
  localStorage.setItem(TWEETS_STORAGE_KEY, JSON.stringify(mockTweets))
  return [...mockTweets]
}

function saveTweets(tweets: Tweet[]) {
  localStorage.setItem(TWEETS_STORAGE_KEY, JSON.stringify(tweets))
}

export const tweetService = {
  async getFeed(): Promise<Tweet[]> {
    await delay(500)
    const tweets = loadTweets()
    return [...tweets].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  },

  async getTweetsByUser(userId: string): Promise<Tweet[]> {
    await delay(300)
    return loadTweets().filter((t) => t.authorId === userId)
  },

  async createTweet(content: string, authorId: string): Promise<Tweet> {
    await delay(400)
    const tweets = loadTweets()
    const newTweet: Tweet = {
      id: `t${Date.now()}`,
      content,
      authorId,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      likedByCurrentUser: false,
    }
    saveTweets([newTweet, ...tweets])
    return newTweet
  },

  async deleteTweet(tweetId: string): Promise<void> {
    await delay(300)
    const tweets = loadTweets()
    saveTweets(tweets.filter((t) => t.id !== tweetId))
  },

  async toggleLike(tweetId: string): Promise<Tweet> {
    await delay(200)
    const tweets = loadTweets()
    const updated = tweets.map((t) =>
      t.id === tweetId
        ? {
            ...t,
            likedByCurrentUser: !t.likedByCurrentUser,
            likesCount: t.likedByCurrentUser ? t.likesCount - 1 : t.likesCount + 1,
          }
        : t
    )
    saveTweets(updated)
    const found = updated.find((t) => t.id === tweetId)
    if (!found) throw new Error('Tweet not found')
    return found
  },
}