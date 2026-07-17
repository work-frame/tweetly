import { useState } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import type { User } from '../types/User'
import { useAuth } from '../context/AuthContext'
import { uploadImage } from '../services/uploadService'
import { Avatar } from './Avatar'

interface EditProfileFormProps {
  currentUser: User
  onClose: () => void
}

const MAX_SIZE_MB = 5

export function EditProfileForm({ currentUser, onClose }: EditProfileFormProps) {
  const { updateProfile } = useAuth()
  const [displayName, setDisplayName] = useState(currentUser.displayName)
  const [bio, setBio] = useState(currentUser.bio)
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

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
      setAvatarUrl(uploadedUrl)
    } catch {
      setError('Image upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!displayName.trim()) {
      setError('Display name cannot be empty.')
      return
    }

    setSaving(true)
    try {
      await updateProfile({
        displayName: displayName.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUrl.trim(),
      })
      onClose()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-b border-gray-200 p-6 dark:border-gray-800"
    >
      <h2 className="mb-4 text-lg font-bold text-black dark:text-white">Edit profile</h2>

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
          className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-black focus:border-black focus:outline-none dark:border-gray-700 dark:bg-black dark:text-white dark:focus:border-white"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-black dark:text-white">
          Bio
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="w-full resize-none rounded border border-gray-300 bg-white px-3 py-2 text-black focus:border-black focus:outline-none dark:border-gray-700 dark:bg-black dark:text-white dark:focus:border-white"
          placeholder="Tell people about yourself..."
        />
      </div>

      <div className="mb-6">
        <label className="mb-1 block text-sm font-medium text-black dark:text-white">
          Profile picture
        </label>
        <div className="flex items-center gap-4">
          <Avatar src={avatarUrl} alt={displayName} className="h-16 w-16" />
          <div>
            <label className="inline-block cursor-pointer rounded-full border border-gray-300 px-4 py-1.5 text-sm font-semibold text-black hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900">
              {uploading ? 'Uploading...' : 'Choose photo'}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
            </label>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              JPG, PNG, or GIF, up to {MAX_SIZE_MB}MB
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-full bg-black px-4 py-1.5 font-semibold text-white hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-gray-300 px-4 py-1.5 font-semibold text-black hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}