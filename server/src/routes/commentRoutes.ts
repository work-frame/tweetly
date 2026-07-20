import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth.js'
import { createComment, getCommentsByTweet, deleteComment } from '../controllers/commentController.js'

const router = Router()

router.get('/tweet/:tweetId', getCommentsByTweet)
router.post('/tweet/:tweetId', requireAuth, createComment)
router.delete('/:id', requireAuth, deleteComment)

export default router
