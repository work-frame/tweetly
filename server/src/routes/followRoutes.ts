import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth.js'
import { toggleFollow, isFollowing } from '../controllers/followController.js'

const router = Router()

router.post('/:targetUserId/toggle', requireAuth, toggleFollow)
router.get('/:targetUserId/status', requireAuth, isFollowing)

export default router