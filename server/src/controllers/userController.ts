import type { Request, Response } from 'express'
import { pool } from '../db.js'

export async function getUserByUsername(req: Request, res: Response) {
  const { username } = req.params

  try {
    const result = await pool.query(
      `SELECT
         u.id, u.username, u.display_name, u.email, u.bio, u.avatar_url, u.created_at,
         (SELECT COUNT(*)::int FROM follows WHERE following_id = u.id) AS followers_count,
         (SELECT COUNT(*)::int FROM follows WHERE follower_id = u.id) AS following_count
       FROM users u
       WHERE u.username = $1`,
      [username]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong fetching the user.' })
  }
}

export async function updateProfile(req: Request & { userId?: string }, res: Response) {
  const userId = req.userId
  const { displayName, bio, avatarUrl } = req.body

  try {
    const result = await pool.query(
      `UPDATE users
       SET display_name = COALESCE($1, display_name),
           bio = COALESCE($2, bio),
           avatar_url = COALESCE($3, avatar_url)
       WHERE id = $4
       RETURNING id, username, display_name, email, bio, avatar_url, created_at`,
      [displayName, bio, avatarUrl, userId]
    )
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong updating the profile.' })
  }
}