import type { User } from '../types/User'
import { mockUsers } from './users'

const USERS_STORAGE_KEY = 'tweetly_users_db'

export function loadUsers(): User[] {
  const stored = localStorage.getItem(USERS_STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(mockUsers))
  return [...mockUsers]
}

export function saveUsers(users: User[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

export function updateUser(userId: string, updates: Partial<User>): User {
  const users = loadUsers()
  const updatedUsers = users.map((u) => (u.id === userId ? { ...u, ...updates } : u))
  saveUsers(updatedUsers)
  const updated = updatedUsers.find((u) => u.id === userId)
  if (!updated) throw new Error('User not found')
  return updated
}