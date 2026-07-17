import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { pool } from './db'
import authRoutes from './routes/authRoutes'
import tweetRoutes from './routes/tweetRoutes'
import followRoutes from './routes/followRoutes'
import likeRoutes from './routes/likeRoutes'
import userRoutes from './routes/userRoutes'
import { requireAuth, type AuthRequest } from './middleware/requireAuth'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Tweetly API is running' })
})

app.get('/health/db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.json({ connected: true, time: result.rows[0].now })
  } catch (err) {
    res.status(500).json({ connected: false, error: (err as Error).message })
  }
})

app.use('/api/auth', authRoutes)

app.get('/api/me', requireAuth, (req: AuthRequest, res) => {
  res.json({ message: 'You are authenticated!', userId: req.userId })
})

app.use('/api/tweets', tweetRoutes)
app.use('/api/follows', followRoutes)
app.use('/api/likes', likeRoutes)
app.use('/api/users', userRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})