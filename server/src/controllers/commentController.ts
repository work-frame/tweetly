import type { Response } from 'express'
import { pool } from '../db.js'
import type { AuthRequest } from '../middleware/requireAuth.js'

export async function createComment(req: AuthRequest, res: Response) {
  const { content } = req.body
  const { tweetId } = req.params
  const authorId = req.userId

  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Comment cannot be empty.' })
  }

  try {
    const result = await pool.query(
      `INSERT INTO comments (content, author_id, tweet_id)
       VALUES ($1, $2, $3)
       RETURNING id, content, author_id, tweet_id, created_at`,
      [content.trim(), authorId, tweetId]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong posting the comment.' })
  }
}

export async function getCommentsByTweet(req: AuthRequest, res: Response) {
  const { tweetId } = req.params

  try {
    const result = await pool.query(
      `SELECT c.id, c.content, c.created_at, c.author_id,
              u.username, u.display_name, u.avatar_url
       FROM comments c
       JOIN users u ON c.author_id = u.id
       WHERE c.tweet_id = $1
       ORDER BY c.created_at ASC`,
      [tweetId]
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong fetching comments.' })
  }
}

export async function deleteComment(req: AuthRequest, res: Response) {
  const { id } = req.params
  const userId = req.userId

  try {
    const comment = await pool.query('SELECT author_id FROM comments WHERE id = $1', [id])

    if (comment.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found.' })
    }
    if (comment.rows[0].author_id !== userId) {
      return res.status(403).json({ error: 'You can only delete your own comments.' })
    }

    await pool.query('DELETE FROM comments WHERE id = $1', [id])
    res.json({ message: 'Comment deleted.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong deleting the comment.' })
  }
}