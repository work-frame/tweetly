import { useEffect, useState } from 'react'
import type { User } from '../types/User'
import { followService } from '../services/followService'
import { Avatar } from './Avatar'

interface ProfileHeaderProps {
  profileUser: User
  isOwnProfile: boolean
  currentUserId: string | undefined
  onFollowChange: () => void
}

export function ProfileHeader({
  profileUser,
  isOwnProfile,
  currentUserId,
  onFollowChange,
}: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (currentUserId && !isOwnProfile) {
      followService.isFollowing(currentUserId, profileUser.id).then(setIsFollowing)
    }
  }, [currentUserId, profileUser.id, isOwnProfile])

  async function handleToggleFollow() {
    if (!currentUserId) return
    setLoading(true)
    const nowFollowing = await followService.toggleFollow(currentUserId, profileUser.id)
    setIsFollowing(nowFollowing)
    setLoading(false)
    onFollowChange()
  }

  const joinedDate = new Date(profileUser.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="border-b border-gray-200 p-6 dark:border-gray-800">
      <div className="flex items-start justify-between">
        <Avatar
          src={profileUser.avatarUrl}
          alt={profileUser.displayName}
          className="h-32 w-32"
          clickable
        />

        {!isOwnProfile && (
          <button
            onClick={handleToggleFollow}
            disabled={loading}
            className={`rounded-full px-4 py-1.5 font-semibold disabled:opacity-50 ${
              isFollowing
                ? 'border border-gray-300 bg-white text-black hover:border-red-300 hover:bg-red-50 hover:text-red-500 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-red-950/30'
                : 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        )}
      </div>

      <div className="mt-3">
        <h1 className="text-xl font-bold text-black dark:text-white">
          {profileUser.displayName}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">@{profileUser.username}</p>
      </div>

      {profileUser.bio && (
        <p className="mt-3 text-black dark:text-white">{profileUser.bio}</p>
      )}

      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Joined {joinedDate}</p>

      <div className="mt-3 flex gap-4 text-sm">
        <span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {profileUser.followingCount}
          </span>{' '}
          <span className="text-gray-500 dark:text-gray-400">Following</span>
        </span>
        <span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {profileUser.followersCount}
          </span>{' '}
          <span className="text-gray-500 dark:text-gray-400">Followers</span>
        </span>
      </div>
    </div>
  )
}