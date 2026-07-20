import { apiFetch } from './api'
import type { Comment } from '../types/Comment'

interface ApiComment {
  id: string
  content: string
  created_at: string
  author_id: string
  username: string
  display_name: string
  avatar_url: string
}

function mapComment(apiComment: ApiComment): Comment {
  return {
    id: apiComment.id,
    content: apiComment.content,
    createdAt: apiComment.created_at,
    authorId: apiComment.author_id,
    author: {
      username: apiComment.username,
      displayName: apiComment.display_name,
      avatarUrl: apiComment.avatar_url,
    },
  }
}

export const commentService = {
  async getCommentsByTweet(tweetId: string): Promise<Comment[]> {
    const data: ApiComment[] = await apiFetch(`/comments/tweet/${tweetId}`)
    return data.map(mapComment)
  },

  async createComment(tweetId: string, content: string): Promise<Comment> {
    const data: ApiComment = await apiFetch(`/comments/tweet/${tweetId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    })
    return mapComment(data)
  },

  async deleteComment(commentId: string): Promise<void> {
    await apiFetch(`/comments/${commentId}`, { method: 'DELETE' })
  },
}