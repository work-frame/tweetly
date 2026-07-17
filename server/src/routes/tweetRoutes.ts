import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth'
import { createTweet, deleteTweet, getFeed, getTweetsByUser } from '../controllers/tweetController'

const router = Router()

router.get('/feed', requireAuth, getFeed)
router.get('/user/:userId', requireAuth, getTweetsByUser)
router.post('/', requireAuth, createTweet)
router.delete('/:id', requireAuth, deleteTweet)

export default router