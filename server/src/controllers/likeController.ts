import type { Response } from 'express'
import { pool } from '../db'
import type { AuthRequest } from '../middleware/requireAuth'

export async function toggleLike(req: AuthRequest, res: Response) {
  const userId = req.userId
  const { tweetId } = req.params

  try {
    const existing = await pool.query(
      'SELECT id FROM likes WHERE user_id = $1 AND tweet_id = $2',
      [userId, tweetId]
    )

    if (existing.rows.length > 0) {
      await pool.query(
        'DELETE FROM likes WHERE user_id = $1 AND tweet_id = $2',
        [userId, tweetId]
      )
      res.json({ liked: false })
    } else {
      await pool.query(
        'INSERT INTO likes (user_id, tweet_id) VALUES ($1, $2)',
        [userId, tweetId]
      )
      res.json({ liked: true })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong updating like status.' })
  }
}