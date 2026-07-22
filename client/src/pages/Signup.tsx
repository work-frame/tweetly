import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!displayName || !username || !email || !password) {
      setError('Please fill in all fields.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      await signup(displayName, username, email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-8 dark:bg-black">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-md sm:p-8 dark:border-gray-800 dark:bg-black"
      >
        <h1 className="mb-6 text-2xl font-bold text-black dark:text-white">Join Tweetly</h1>

        {error && (
          <div className="mb-4 rounded bg-red-100 p-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-black dark:text-white">
            Display name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-base text-black focus:border-black focus:outline-none dark:border-gray-700 dark:bg-black dark:text-white dark:focus:border-white"
            placeholder="John Doe"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-black dark:text-white">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-base text-black focus:border-black focus:outline-none dark:border-gray-700 dark:bg-black dark:text-white dark:focus:border-white"
            placeholder="johndoe"
          />
        </div>

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-black dark:text-white">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-base text-black focus:border-black focus:outline-none dark:border-gray-700 dark:bg-black dark:text-white dark:focus:border-white"
            placeholder="you@example.com"
          />
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-black dark:text-white">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-base text-black focus:border-black focus:outline-none dark:border-gray-700 dark:bg-black dark:text-white dark:focus:border-white"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-black py-2 font-semibold text-white hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          {loading ? 'Signing up...' : 'Sign up'}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-black hover:underline dark:text-white">
            Log in
          </Link>
        </p>
      </form>
    </div>
  )
}