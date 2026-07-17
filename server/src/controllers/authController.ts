import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { pool } from '../db'
import { signToken } from '../utils/jwt'

export async function signup(req: Request, res: Response) {
  const { displayName, username, email, password } = req.body

  if (!displayName || !username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' })
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' })
  }

  try {
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    )
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email or username already in use.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await pool.query(
      `INSERT INTO users (username, display_name, email, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, display_name, email, bio, avatar_url, created_at`,
      [username, displayName, email, hashedPassword]
    )

    const user = result.rows[0]
    const token = signToken({ userId: user.id })

    res.status(201).json({ user, token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong during signup.' })
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    const user = result.rows[0]

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const passwordMatches = await bcrypt.compare(password, user.password)
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    const token = signToken({ userId: user.id })

    const { password: _password, ...userWithoutPassword } = user
    res.json({ user: userWithoutPassword, token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong during login.' })
  }
}