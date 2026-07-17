import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import type { User } from '../types/User'
import type { Tweet } from '../types/Tweet'
import { userService } from '../services/userService'
import { tweetService } from '../services/tweetService'
import { useAuth } from '../context/AuthContext'
import { ProfileHeader } from '../components/ProfileHeader'
import { TweetCard } from '../components/TweetCard'
import { EditProfileForm } from '../components/EditProfileForm'

export function Profile() {
  const { username } = useParams<{ username: string }>()
  const { user: currentUser } = useAuth()

  const [profileUser, setProfileUser] = useState<User | null>(null)
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [username])

  async function loadProfile() {
    if (!username) return
    setLoading(true)
    try {
      const foundUser = await userService.getUserByUsername(username)
      setProfileUser(foundUser)
      const userTweets = await tweetService.getTweetsByUser(foundUser.id)
      setTweets(userTweets)
    } catch {
      setProfileUser(null)
    }
    setLoading(false)
  }

  async function handleToggleLike(tweetId: string) {
    await tweetService.toggleLike(tweetId)
    setTweets((prev) =>
      prev.map((tweet) =>
        tweet.id === tweetId
          ? {
              ...tweet,
              likedByCurrentUser: !tweet.likedByCurrentUser,
              likesCount: tweet.likedByCurrentUser
                ? tweet.likesCount - 1
                : tweet.likesCount + 1,
            }
          : tweet
      )
    )
  }

  async function handleDelete(tweetId: string) {
    await tweetService.deleteTweet(tweetId)
    setTweets((prev) => prev.filter((tweet) => tweet.id !== tweetId))
  }

  function handleEditClose() {
    setIsEditing(false)
    loadProfile()
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-400 dark:text-gray-500">
        Loading profile...
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="p-8 text-center text-gray-400 dark:text-gray-500">
        User not found.
      </div>
    )
  }

  const isOwnProfile = currentUser?.id === profileUser.id

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
      {isEditing && currentUser ? (
        <EditProfileForm currentUser={currentUser} onClose={handleEditClose} />
      ) : (
        <>
          <ProfileHeader
            profileUser={profileUser}
            isOwnProfile={isOwnProfile}
            currentUserId={currentUser?.id}
            onFollowChange={loadProfile}
          />
          {isOwnProfile && (
            <div className="border-b border-gray-200 p-4 dark:border-gray-800">
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-semibold text-black hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900"
              >
                Edit profile
              </button>
            </div>
          )}
        </>
      )}

      {tweets.length === 0 ? (
        <div className="p-8 text-center text-gray-400 dark:text-gray-500">No tweets yet.</div>
      ) : (
        tweets.map((tweet) => (
          <TweetCard
            key={tweet.id}
            tweet={tweet}
            author={profileUser}
            currentUserId={currentUser?.id ?? ''}
            onToggleLike={handleToggleLike}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  )
}