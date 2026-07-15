import type { User } from '../types/User'

export const mockUsers: User[] = [
  {
    id: 'u1',
    username: 'johndoe',
    displayName: 'John Doe',
    email: 'john@example.com',
    bio: 'Full-stack dev. Coffee enthusiast. Building things one bug at a time.',
    avatarUrl: 'https://i.pravatar.cc/150?u=u1',
    followersCount: 128,
    followingCount: 97,
    createdAt: '2023-03-14T00:00:00.000Z',
  },
  {
    id: 'u2',
    username: 'janedev',
    displayName: 'Jane Smith',
    email: 'jane@example.com',
    bio: 'Frontend engineer. React + TypeScript. She/her.',
    avatarUrl: 'https://i.pravatar.cc/150?u=u2',
    followersCount: 342,
    followingCount: 210,
    createdAt: '2022-11-02T00:00:00.000Z',
  },
  {
    id: 'u3',
    username: 'mike_codes',
    displayName: 'Mike Johnson',
    email: 'mike@example.com',
    bio: 'Backend engineer. PostgreSQL nerd.',
    avatarUrl: 'https://i.pravatar.cc/150?u=u3',
    followersCount: 56,
    followingCount: 40,
    createdAt: '2024-01-20T00:00:00.000Z',
  },
]

export const currentMockUser: User = mockUsers[0]