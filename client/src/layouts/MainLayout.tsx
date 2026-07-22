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
      <nav className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 bg-white px-3 py-2 sm:gap-4 sm:px-6 sm:py-3 dark:border-gray-800 dark:bg-black">
        <Link to="/" className="text-lg font-bold text-black sm:text-xl dark:text-white">
          Tweetly
        </Link>

        <div className="order-3 w-full sm:order-none sm:w-auto sm:flex-1 sm:max-w-xs">
          <SearchBar />
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
          >
            Home
          </Link>
          {user && (
            <Link
              to={`/profile/${user.username}`}
              className="hidden text-sm font-medium text-gray-700 hover:text-black sm:inline dark:text-gray-300 dark:hover:text-white"
            >
              Profile
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            className="rounded-full border border-gray-300 p-1.5 text-sm hover:bg-gray-100 sm:p-2 dark:border-gray-700 dark:hover:bg-gray-900"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {user && (
            <>
              <Link to={`/profile/${user.username}`}>
                <Avatar src={user.avatarUrl} alt={user.displayName} className="h-8 w-8" />
              </Link>
              <span className="hidden text-sm font-medium text-black sm:inline dark:text-white">
                {user.displayName}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-full bg-black px-2.5 py-1 text-xs font-medium text-white hover:bg-gray-800 sm:px-3 sm:py-1 sm:text-sm dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                Log out
              </button>
            </>
          )}
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-2 py-4 sm:px-4 sm:py-6">{children}</main>
    </div>
  )
}