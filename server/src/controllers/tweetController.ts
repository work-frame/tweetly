import type { Response } from 'express'
import { pool } from '../db.js'
import type { AuthRequest } from '../middleware/requireAuth.js'

const MAX_TWEET_LENGTH = 280

export async function createTweet(req: AuthRequest, res: Response) {
  const { content, imageUrl } = req.body
  const authorId = req.userId

  const hasContent = content && content.trim().length > 0
  const hasImage = imageUrl && imageUrl.trim().length > 0

  if (!hasContent && !hasImage) {
    return res.status(400).json({ error: 'Tweet must have text or an image.' })
  }
  if (content && content.length > MAX_TWEET_LENGTH) {
    return res.status(400).json({ error: `Tweet cannot exceed ${MAX_TWEET_LENGTH} characters.` })
  }

  try {
    const result = await pool.query(
      `INSERT INTO tweets (content, author_id, image_url)
       VALUES ($1, $2, $3)
       RETURNING id, content, author_id, created_at, views_count, image_url`,
      [hasContent ? content.trim() : '', authorId, hasImage ? imageUrl.trim() : null]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong creating the tweet.' })
  }
}

export async function deleteTweet(req: AuthRequest, res: Response) {
  const { id } = req.params
  const userId = req.userId

  try {
    const tweet = await pool.query('SELECT author_id FROM tweets WHERE id = $1', [id])

    if (tweet.rows.length === 0) {
      return res.status(404).json({ error: 'Tweet not found.' })
    }
    if (tweet.rows[0].author_id !== userId) {
      return res.status(403).json({ error: 'You can only delete your own tweets.' })
    }

    await pool.query('DELETE FROM tweets WHERE id = $1', [id])
    res.json({ message: 'Tweet deleted.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong deleting the tweet.' })
  }
}

export async function getFeed(req: AuthRequest, res: Response) {
  const limit = parseInt(req.query.limit as string) || 10
  const offset = parseInt(req.query.offset as string) || 0
  const currentUserId = req.userId

  try {
    const result = await pool.query(
      `SELECT
         t.id, t.content, t.created_at, t.author_id, t.views_count, t.image_url,
         u.username, u.display_name, u.avatar_url,
         COUNT(DISTINCT l.id)::int AS likes_count,
         EXISTS(
           SELECT 1 FROM likes
           WHERE tweet_id = t.id AND user_id = $1
         ) AS liked_by_current_user
       FROM tweets t
       JOIN users u ON t.author_id = u.id
       LEFT JOIN likes l ON l.tweet_id = t.id
       GROUP BY t.id, u.username, u.display_name, u.avatar_url
       ORDER BY t.created_at DESC
       LIMIT $2 OFFSET $3`,
      [currentUserId, limit, offset]
    )

    const tweetIds = result.rows.map((row) => row.id)
    if (tweetIds.length > 0) {
      await pool.query(
        `UPDATE tweets SET views_count = views_count + 1 WHERE id = ANY($1::text[])`,
        [tweetIds]
      )
      result.rows.forEach((row) => {
        row.views_count = row.views_count + 1
      })
    }

    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong fetching the feed.' })
  }
}

export async function getTweetsByUser(req: AuthRequest, res: Response) {
  const { userId } = req.params
  const currentUserId = req.userId

  try {
    const result = await pool.query(
      `SELECT
         t.id, t.content, t.created_at, t.author_id, t.views_count, t.image_url,
         u.username, u.display_name, u.avatar_url,
         COUNT(DISTINCT l.id)::int AS likes_count,
         EXISTS(
           SELECT 1 FROM likes
           WHERE tweet_id = t.id AND user_id = $1
         ) AS liked_by_current_user
       FROM tweets t
       JOIN users u ON t.author_id = u.id
       LEFT JOIN likes l ON l.tweet_id = t.id
       WHERE t.author_id = $2
       GROUP BY t.id, u.username, u.display_name, u.avatar_url
       ORDER BY t.created_at DESC`,
      [currentUserId, userId]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong fetching tweets.' })
  }
}