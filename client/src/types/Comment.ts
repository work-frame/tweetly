export interface Comment {
  id: string
  content: string
  createdAt: string
  authorId: string
  author: {
    username: string
    displayName: string
    avatarUrl: string
  }
}