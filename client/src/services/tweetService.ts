import { apiFetch } from './api'
import type { Tweet } from '../types/Tweet'
import type { User } from '../types/User'

interface ApiTweet {
  id: string
  content: string
  author_id: string
  created_at: string
  likes_count: number
  liked_by_current_user: boolean
  views_count: number
  image_url: string | null
  username?: string
  display_name?: string
  avatar_url?: string
}

export interface FeedTweet extends Tweet {
  author: Pick<User, 'username' | 'displayName' | 'avatarUrl'>
}

function mapTweet(apiTweet: ApiTweet): Tweet {
  return {
    id: apiTweet.id,
    content: apiTweet.content,
    authorId: apiTweet.author_id,
    createdAt: apiTweet.created_at,
    likesCount: apiTweet.likes_count,
    likedByCurrentUser: apiTweet.liked_by_current_user,
    viewsCount: apiTweet.views_count,
    imageUrl: apiTweet.image_url,
  }
}

function mapFeedTweet(apiTweet: ApiTweet): FeedTweet {
  return {
    ...mapTweet(apiTweet),
    author: {
      username: apiTweet.username ?? '',
      displayName: apiTweet.display_name ?? 'Unknown user',
      avatarUrl: apiTweet.avatar_url ?? '',
    },
  }
}

export const tweetService = {
  async getFeed(): Promise<FeedTweet[]> {
    const data: ApiTweet[] = await apiFetch('/tweets/feed?limit=50')
    return data.map(mapFeedTweet)
  },

  async getTweetsByUser(userId: string): Promise<Tweet[]> {
    const data: ApiTweet[] = await apiFetch(`/tweets/user/${userId}`)
    return data.map(mapTweet)
  },

  async createTweet(content: string, imageUrl?: string): Promise<Tweet> {
    const data: ApiTweet = await apiFetch('/tweets', {
      method: 'POST',
      body: JSON.stringify({ content, imageUrl }),
    })
    return mapTweet(data)
  },

  async deleteTweet(tweetId: string): Promise<void> {
    await apiFetch(`/tweets/${tweetId}`, { method: 'DELETE' })
  },

  async toggleLike(tweetId: string): Promise<void> {
    await apiFetch(`/likes/${tweetId}/toggle`, { method: 'POST' })
  },
}