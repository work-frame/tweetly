import { loadUsers, saveUsers } from '../mocks/usersStore'

const FOLLOWS_STORAGE_KEY = 'tweetly_follows_db'

interface FollowRelation {
  followerId: string
  followingId: string
}

function loadFollows(): FollowRelation[] {
  const stored = localStorage.getItem(FOLLOWS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

function saveFollows(follows: FollowRelation[]) {
  localStorage.setItem(FOLLOWS_STORAGE_KEY, JSON.stringify(follows))
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const followService = {
  async isFollowing(followerId: string, targetId: string): Promise<boolean> {
    await delay(150)
    const follows = loadFollows()
    return follows.some(
      (f) => f.followerId === followerId && f.followingId === targetId
    )
  },

  async toggleFollow(followerId: string, targetId: string): Promise<boolean> {
    await delay(300)
    const follows = loadFollows()
    const users = loadUsers()

    const alreadyFollowing = follows.some(
      (f) => f.followerId === followerId && f.followingId === targetId
    )

    let updatedFollows: FollowRelation[]
    let countDelta: number

    if (alreadyFollowing) {
      updatedFollows = follows.filter(
        (f) => !(f.followerId === followerId && f.followingId === targetId)
      )
      countDelta = -1
    } else {
      updatedFollows = [...follows, { followerId, followingId: targetId }]
      countDelta = 1
    }

    const updatedUsers = users.map((u) => {
      if (u.id === followerId) {
        return { ...u, followingCount: u.followingCount + countDelta }
      }
      if (u.id === targetId) {
        return { ...u, followersCount: u.followersCount + countDelta }
      }
      return u
    })

    saveFollows(updatedFollows)
    saveUsers(updatedUsers)

    return !alreadyFollowing
  },
}