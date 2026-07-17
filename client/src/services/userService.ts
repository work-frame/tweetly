import { apiFetch } from './api'
import type { User } from '../types/User'

interface ApiUser {
  id: string
  username: string
  display_name: string
  email: string
  bio: string
  avatar_url: string
  created_at: string
  followers_count: number
  following_count: number
}

function mapUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    username: apiUser.username,
    displayName: apiUser.display_name,
    email: apiUser.email,
    bio: apiUser.bio,
    avatarUrl: apiUser.avatar_url,
    followersCount: apiUser.followers_count,
    followingCount: apiUser.following_count,
    createdAt: apiUser.created_at,
  }
}

export const userService = {
  async getUserByUsername(username: string): Promise<User> {
    const data: ApiUser = await apiFetch(`/users/${username}`)
    return mapUser(data)
  },

  async updateProfile(updates: { displayName?: string; bio?: string; avatarUrl?: string }): Promise<User> {
    const data: ApiUser = await apiFetch('/users/me', {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
    return mapUser(data)
  },
}