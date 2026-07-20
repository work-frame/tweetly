import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth.js'
import { createTweet, deleteTweet, getFeed, getTweetsByUser } from '../controllers/tweetController.js'

const router = Router()

router.get('/feed', requireAuth, getFeed)
router.get('/user/:userId', requireAuth, getTweetsByUser)
router.post('/', requireAuth, createTweet)
router.delete('/:id', requireAuth, deleteTweet)

export default router