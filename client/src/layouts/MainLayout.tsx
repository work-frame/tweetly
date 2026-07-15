import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { SearchBar } from '../components/SearchBar'
import { Avatar } from '../components/Avatar'

export function MainLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <nav className="flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-800 dark:bg-black">
        <Link to="/" className="text-xl font-bold text-black dark:text-white">
          Tweetly
        </Link>

        <SearchBar />

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
          >
            Home
          </Link>
          {user && (
            <Link
              to={`/profile/${user.username}`}
              className="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
            >
              Profile
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="rounded-full border border-gray-300 p-2 text-sm hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {user && (
            <>
             <Avatar src={user.avatarUrl} alt={user.displayName} className="h-8 w-8" />
              <span className="text-sm font-medium text-black dark:text-white">
                {user.displayName}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full bg-black px-3 py-1 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                Log out
              </button>
            </>
          )}
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>
    </div>
  )
}