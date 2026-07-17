import { apiFetch } from './api'
import type { User } from '../types/User'

interface AuthResponse {
  user: {
    id: string
    username: string
    display_name: string
    email: string
    bio: string
    avatar_url: string
    created_at: string
  }
  token: string
}

function mapUser(apiUser: AuthResponse['user']): User {
  return {
    id: apiUser.id,
    username: apiUser.username,
    displayName: apiUser.display_name,
    email: apiUser.email,
    bio: apiUser.bio,
    avatarUrl: apiUser.avatar_url,
    followersCount: 0,
    followingCount: 0,
    createdAt: apiUser.created_at,
  }
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const data: AuthResponse = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    localStorage.setItem('tweetly_token', data.token)
    return mapUser(data.user)
  },

  async signup(
    displayName: string,
    username: string,
    email: string,
    password: string
  ): Promise<User> {
    const data: AuthResponse = await apiFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ displayName, username, email, password }),
    })
    localStorage.setItem('tweetly_token', data.token)
    return mapUser(data.user)
  },
}