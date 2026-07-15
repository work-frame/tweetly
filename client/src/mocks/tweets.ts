import type { Tweet } from '../types/Tweet'

export const mockTweets: Tweet[] = [
  {
    id: 't1',
    content: 'Just deployed my first full-stack app! 🚀',
    authorId: 'u1',
    createdAt: '2026-07-14T09:30:00.000Z',
    likesCount: 12,
    likedByCurrentUser: false,
  },
  {
    id: 't2',
    content: 'TypeScript really does save you from yourself sometimes.',
    authorId: 'u2',
    createdAt: '2026-07-14T10:15:00.000Z',
    likesCount: 34,
    likedByCurrentUser: true,
  },
  {
    id: 't3',
    content: 'Anyone else think Tailwind spoils you once you get used to it?',
    authorId: 'u2',
    createdAt: '2026-07-14T11:00:00.000Z',
    likesCount: 8,
    likedByCurrentUser: false,
  },
  {
    id: 't4',
    content: 'PostgreSQL indexes are underrated. Learn them, love them.',
    authorId: 'u3',
    createdAt: '2026-07-13T18:45:00.000Z',
    likesCount: 21,
    likedByCurrentUser: false,
  },
  {
    id: 't5',
    content: 'Working on a Twitter clone as a learning project. Feed component next!',
    authorId: 'u1',
    createdAt: '2026-07-13T20:00:00.000Z',
    likesCount: 5,
    likedByCurrentUser: false,
  },
]