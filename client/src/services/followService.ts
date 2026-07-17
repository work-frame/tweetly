import { apiFetch } from './api'

export const followService = {
  async isFollowing(_followerId: string, targetId: string): Promise<boolean> {
    const data = await apiFetch(`/follows/${targetId}/status`)
    return data.following
  },

  async toggleFollow(_followerId: string, targetId: string): Promise<boolean> {
    const data = await apiFetch(`/follows/${targetId}/toggle`, { method: 'POST' })
    return data.following
  },
}