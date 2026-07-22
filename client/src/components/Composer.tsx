import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { uploadImage } from '../services/uploadService'

const MAX_CHARS = 280
const MAX_SIZE_MB = 5

interface ComposerProps {
  onSubmit: (content: string, imageUrl?: string) => Promise<void>
}

export function Composer({ onSubmit }: ComposerProps) {
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')

  const remaining = MAX_CHARS - content.length
  const hasContent = content.trim().length > 0
  const hasImage = imageUrl.trim().length > 0
  const isValid = (hasContent || hasImage) && remaining >= 0

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image must be smaller than ${MAX_SIZE_MB}MB.`)
      return
    }

    setError('')
    setUploading(true)
    try {
      const uploadedUrl = await uploadImage(file)
      setImageUrl(uploadedUrl)
    } catch {
      setError('Image upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  function removeImage() {
    setImageUrl('')
  }

  async function handleSubmit() {
    if (!isValid) return
    setPosting(true)
    try {
      await onSubmit(content.trim(), imageUrl || undefined)
      setContent('')
      setImageUrl('')
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="border-b border-gray-200 p-3 sm:p-4 dark:border-gray-800">
      {error && (
        <div className="mb-2 rounded bg-red-100 p-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
        rows={3}
        className="w-full resize-none border-none bg-transparent text-base text-black placeholder-gray-400 focus:outline-none sm:text-lg dark:text-white dark:placeholder-gray-500"
      />

      {imageUrl && (
        <div className="relative mt-2 inline-block w-full sm:w-auto">
          <img
            src={imageUrl}
            alt="Upload preview"
            className="max-h-48 w-full rounded-xl border border-gray-200 object-cover sm:max-h-64 sm:w-auto dark:border-gray-800"
          />
          <button
            onClick={removeImage}
            className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white hover:bg-black"
          >
            Remove
          </button>
        </div>
      )}

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <label className="cursor-pointer text-lg text-blue-500 hover:text-blue-600">
            {uploading ? '...' : '🖼️'}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading || !!imageUrl}
              className="hidden"
            />
          </label>
          <span
            className={`text-sm ${remaining < 0 ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}
          >
            {remaining}
          </span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={!isValid || posting || uploading}
          className="rounded-full bg-black px-3 py-1.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50 sm:px-4 sm:text-base dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          {posting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  )
}