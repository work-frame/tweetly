# Tweetly

A Twitter/X clone built as a learning project. Fully deployed, full-stack, with a real database — not a demo.

**Live app:** https://tweetly-rose.vercel.app
**Live API:** https://tweetly-t1jv.onrender.com

## Stack

**Frontend**
- React (Vite) + TypeScript
- Tailwind CSS
- React Router
- Context API (auth + theme state)

**Backend**
- Node.js / Express + TypeScript
- PostgreSQL (hosted on Neon), accessed via raw SQL with the `pg` library
- JWT authentication + bcrypt password hashing
- Cloudinary for image uploads (avatars and tweet images)

**Deployment**
- Frontend: Vercel
- Backend: Render
- Database: Neon

## Project structure

```
tweetly/
  client/                 React frontend
    src/
      components/         Reusable UI (TweetCard, Composer, Avatar, SearchBar, CommentSection, etc.)
      pages/               Route-level views (Login, Signup, Feed, Profile)
      layouts/             MainLayout (navbar, page shell)
      context/             AuthContext, ThemeContext
      services/            api.ts (shared fetch helper) + one service per resource
                            (authService, tweetService, followService, userService,
                            commentService, uploadService)
      types/               Shared TypeScript types (User, Tweet, Comment)
  server/                  Express backend
    src/
      controllers/         Route handlers (auth, tweets, follows, likes, users, comments)
      routes/               Express routers, one per resource
      middleware/           requireAuth (JWT verification)
      utils/                 jwt.ts (sign/verify helpers)
      db.ts                 PostgreSQL connection pool
      index.ts              App entry point, CORS, route registration
    db/
      schema.sql            Full database schema
```

## Current status

### ✅ Working features
- Sign up / log in / log out, with real JWT-based sessions
- Protected routes (redirects to login if not authenticated, returns you to where you were headed after logging in)
- Home feed: post a tweet (text and/or image, 280-char limit, optional caption), like/unlike, delete your own tweets
- Comments on tweets — post, view, delete your own
- View counts — increments once per unique viewer per tweet (not per page load)
- Image upload on tweets and profile avatars, via Cloudinary, straight from device storage
- "Load more" pagination on the feed
- Live-ish updates — the feed and open comment sections poll the server periodically, so likes/comments from other users show up without a manual refresh
- Profile pages: bio, avatar, joined date, follower/following counts
- Follow / unfollow, with live count updates on both profiles
- Edit profile (display name, bio, avatar photo upload)
- Search bar to find users by username or display name
- Full dark/light theme toggle, persisted across sessions
- Click-to-enlarge avatar view on profile pages

### ⚠️ Known limitations
- **Free-tier cold starts**: the backend (Render free tier) spins down after ~15 minutes of inactivity. The first request after idle time can take up to a minute to respond while the server wakes up; subsequent requests are fast.
- **Polling, not true real-time**: feed/comment updates from other users appear within ~10-15 seconds, not instantly. True real-time (WebSockets) is a stretch goal, not yet built.

### ⬜ Not built yet (stretch goals)
- Retweets
- Replies/threads (as opposed to flat comments)
- Notifications
- Real-time updates via WebSockets (Socket.io)
- Trending/hashtags
- Direct messages
- Rate limiting on posts

## Running locally

### Frontend
```bash
cd client
npm install
npm run dev
```
Open the local URL shown in the terminal (usually `http://localhost:5173`).

### Backend
```bash
cd server
npm install
npm run dev
```
Runs on `http://localhost:5000` by default. Requires a `.env` file (see `.env.example`) with:
- `DATABASE_URL` — a PostgreSQL connection string (e.g. from [Neon](https://neon.tech))
- `JWT_SECRET` — any long random string, used to sign auth tokens
- `PORT` — defaults to 5000 if unset

The database schema is in `server/db/schema.sql` — run it once against a fresh database to create the tables.

## Linting

```bash
cd client
npm run lint
```