import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../services/api'
import { Avatar } from './Avatar'

interface SearchResult {
  id: string
  username: string
  display_name: string
  avatar_url: string
}

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([])
      setIsOpen(false)
      return
    }

    const timeout = setTimeout(async () => {
      try {
        const data: SearchResult[] = await apiFetch(
          `/users/search?q=${encodeURIComponent(query.trim())}`
        )
        setResults(data.slice(0, 6))
        setIsOpen(true)
      } catch {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(timeout)
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
                <Avatar src={u.avatar_url} alt={u.display_name} className="h-8 w-8" />
                <div>
                  <div className="text-sm font-semibold text-black dark:text-white">
                    {u.display_name}
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