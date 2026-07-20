import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { pool } from './db.js'
import authRoutes from './routes/authRoutes.js'
import tweetRoutes from './routes/tweetRoutes.js'
import followRoutes from './routes/followRoutes.js'
import likeRoutes from './routes/likeRoutes.js'
import userRoutes from './routes/userRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import { requireAuth, type AuthRequest } from './middleware/requireAuth.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

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
app.use('/api/comments', commentRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})