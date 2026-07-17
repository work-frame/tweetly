import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth'
import { getUserByUsername, updateProfile } from '../controllers/userController'

const router = Router()

router.get('/:username', getUserByUsername)
router.put('/me', requireAuth, updateProfile)

export default router