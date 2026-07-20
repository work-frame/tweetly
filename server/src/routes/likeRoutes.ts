import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth.js'
import { toggleLike } from '../controllers/likeController.js'

const router = Router()

router.post('/:tweetId/toggle', requireAuth, toggleLike)

export default router