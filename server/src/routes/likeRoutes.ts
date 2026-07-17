import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth'
import { toggleLike } from '../controllers/likeController'

const router = Router()

router.post('/:tweetId/toggle', requireAuth, toggleLike)

export default router