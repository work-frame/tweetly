import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types/User'
import { authService } from '../services/authService'
import { updateUser } from '../mocks/usersStore'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (
    displayName: string,
    username: string,
    email: string,
    password: string
  ) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'tweetly_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // on first load, check if a session was saved
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  function persistUser(newUser: User) {
    setUser(newUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
  }

  async function login(email: string, password: string) {
    const loggedInUser = await authService.login(email, password)
    persistUser(loggedInUser)
  }

  async function signup(
    displayName: string,
    username: string,
    email: string,
    password: string
  ) {
    const newUser = await authService.signup(displayName, username, email, password)
    persistUser(newUser)
  }

  function logout() {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  async function updateProfile(updates: Partial<User>) {
    if (!user) return
    const updated = updateUser(user.id, updates)
    persistUser(updated)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}