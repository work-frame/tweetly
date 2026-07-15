export interface Tweet {
  id: string
  content: string
  authorId: string
  createdAt: string
  likesCount: number
  likedByCurrentUser: boolean
}