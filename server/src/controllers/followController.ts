import type { Response } from 'express'
import { pool } from '../db'
import type { AuthRequest } from '../middleware/requireAuth'

export async function toggleFollow(req: AuthRequest, res: Response) {
  const followerId = req.userId
  const { targetUserId } = req.params

  if (followerId === targetUserId) {
    return res.status(400).json({ error: 'You cannot follow yourself.' })
  }

  try {
    const existing = await pool.query(
      'SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2',
      [followerId, targetUserId]
    )

    if (existing.rows.length > 0) {
      await pool.query(
        'DELETE FROM follows WHERE follower_id = $1 AND following_id = $2',
        [followerId, targetUserId]
      )
      res.json({ following: false })
    } else {
      await pool.query(
        'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)',
        [followerId, targetUserId]
      )
      res.json({ following: true })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong updating follow status.' })
  }
}

export async function isFollowing(req: AuthRequest, res: Response) {
  const followerId = req.userId
  const { targetUserId } = req.params

  try {
    const result = await pool.query(
      'SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2',
      [followerId, targetUserId]
    )
    res.json({ following: result.rows.length > 0 })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong checking follow status.' })
  }
}