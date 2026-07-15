import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { User } from '../types/User'
import { loadUsers } from '../mocks/usersStore'
import { Avatar } from './Avatar'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<User[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([])
      setIsOpen(false)
      return
    }

    const users = loadUsers()
    const lowerQuery = query.trim().toLowerCase()
    const matches = users.filter(
      (u) =>
        u.username.toLowerCase().includes(lowerQuery) ||
        u.displayName.toLowerCase().includes(lowerQuery)
    )
    setResults(matches.slice(0, 6))
    setIsOpen(true)
  }, [query])

  // close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(username: string) {
    setQuery('')
    setResults([])
    setIsOpen(false)
    navigate(`/profile/${username}`)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.trim().length > 0 && setIsOpen(true)}
        placeholder="Search users..."
        className="w-full rounded-full border border-gray-300 bg-gray-100 px-4 py-1.5 text-sm text-black placeholder-gray-500 focus:border-black focus:bg-white focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500 dark:focus:border-white dark:focus:bg-black"
      />

      {isOpen && (
        <div className="absolute top-full z-10 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-black">
          {results.length === 0 ? (
            <div className="p-3 text-sm text-gray-400 dark:text-gray-500">
              No users found.
            </div>
          ) : (
            results.map((u) => (
              <button
                key={u.id}
                onClick={() => handleSelect(u.username)}
                className="flex w-full items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <Avatar src={u.avatarUrl} alt={u.displayName} className="h-8 w-8" />
                <div>
                  <div className="text-sm font-semibold text-black dark:text-white">
                    {u.displayName}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    @{u.username}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}