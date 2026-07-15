import type { User } from '../types/User'
import { mockUsers } from '../mocks/users'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const USERS_STORAGE_KEY = 'tweetly_users_db'

function loadUsers(): User[] {
  const stored = localStorage.getItem(USERS_STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  // first time ever loading — seed with mock users and save
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(mockUsers))
  return [...mockUsers]
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

export const authService = {
  async login(email: string, _password: string): Promise<User> {
    await delay(600)
    const users = loadUsers()
    const user = users.find((u) => u.email === email)
    if (!user) {
      throw new Error('Invalid email or password')
    }
    return user
  },

  async signup(
    displayName: string,
    username: string,
    email: string,
    _password: string
  ): Promise<User> {
    await delay(600)
    const users = loadUsers()

    const existingEmail = users.find((u) => u.email === email)
    if (existingEmail) {
      throw new Error('An account with this email already exists.')
    }

    const existingUsername = users.find((u) => u.username === username)
    if (existingUsername) {
      throw new Error('This username is already taken.')
    }

    const newUser: User = {
      id: `u${Date.now()}`,
      username,
      displayName,
      email,
      bio: '',
      avatarUrl: '',
      followersCount: 0,
      followingCount: 0,
      createdAt: new Date().toISOString(),
    }

    saveUsers([...users, newUser])
    return newUser
  },
}