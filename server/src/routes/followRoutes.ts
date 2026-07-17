import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth'
import { toggleFollow, isFollowing } from '../controllers/followController'

const router = Router()

router.post('/:targetUserId/toggle', requireAuth, toggleFollow)
router.get('/:targetUserId/status', requireAuth, isFollowing)

export default router