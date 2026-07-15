import { useState } from 'react'

const MAX_CHARS = 280

interface ComposerProps {
  onSubmit: (content: string) => Promise<void>
}

export function Composer({ onSubmit }: ComposerProps) {
  const [content, setContent] = useState('')
  const [posting, setPosting] = useState(false)

  const remaining = MAX_CHARS - content.length
  const isValid = content.trim().length > 0 && remaining >= 0

  async function handleSubmit() {
    if (!isValid) return
    setPosting(true)
    try {
      await onSubmit(content.trim())
      setContent('')
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="border-b border-gray-200 p-4 dark:border-gray-800">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
        rows={3}
        className="w-full resize-none border-none bg-transparent text-lg text-black placeholder-gray-400 focus:outline-none dark:text-white dark:placeholder-gray-500"
      />
      <div className="mt-2 flex items-center justify-between">
        <span
          className={`text-sm ${remaining < 0 ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}
        >
          {remaining}
        </span>
        <button
          onClick={handleSubmit}
          disabled={!isValid || posting}
          className="rounded-full bg-black px-4 py-1.5 font-semibold text-white hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          {posting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  )
}