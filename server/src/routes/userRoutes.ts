import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth.js'
import { getUserByUsername, updateProfile, searchUsers } from '../controllers/userController.js'

const router = Router()

router.get('/search', searchUsers)
router.get('/:username', getUserByUsername)
router.put('/me', requireAuth, updateProfile)

export default router