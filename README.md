# Tweetly

A Twitter/X clone built as a learning project. Currently a fully working **frontend** running on mock data — no backend yet.

## Stack

- **React** (Vite) + **TypeScript**
- **Tailwind CSS**
- **React Router**
- **Context API** (auth + theme state)
- **npm**

Backend (planned): Node.js/Express + PostgreSQL + JWT auth.

## Project structure

```
tweetly/
  client/              React frontend (this is what's built so far)
    src/
      components/      Reusable UI (TweetCard, Composer, Avatar, SearchBar, etc.)
      pages/            Route-level views (Login, Signup, Feed, Profile)
      layouts/          MainLayout (navbar, page shell)
      context/          AuthContext, ThemeContext
      services/         authService, tweetService, followService
      mocks/            Mock data + localStorage-backed "database" helpers
      types/            Shared TypeScript types (User, Tweet)
  server/               Reserved for backend (not started yet)
```

## Current status

### ✅ Working features
- Sign up / log in / log out, with session persisted across page refreshes
- Protected routes (redirects to login if not authenticated, returns you to where you were headed after logging in)
- Home feed: post a tweet (280-char limit), like/unlike, delete your own tweets
- "Load more" pagination on the feed
- Profile pages: bio, avatar, joined date, follower/following counts
- Follow / unfollow, with live count updates on both profiles
- Edit profile (display name, bio, avatar URL)
- Blank default avatar for new signups, with a click-to-enlarge view on profile pages
- Search bar to find users by username or display name
- Full dark/light theme toggle, persisted across sessions

### ⚠️ Known limitation
There is no real backend yet. All "persistence" — users, tweets, follows, sessions, theme — is stored in the browser's `localStorage`, acting as a stand-in database. This means:
- Data is per-browser, not shared between devices or users
- Clearing browser storage wipes all app data

This was a deliberate choice to build and test the full UI/UX before the backend exists. The app was structured with a clean service-layer pattern (`services/authService.ts`, `services/tweetService.ts`, `services/followService.ts`) specifically so that swapping this mock layer for real API calls later won't require changing any components — only the internals of those three files.

### ⬜ Not built yet
- Real backend (Node/Express, PostgreSQL, JWT auth)
- Real API endpoints with server-side validation and pagination
- Deployment
- Optional extras: retweets, replies/threads, image upload, notifications, responsive/mobile polish

## Running locally

```bash
cd client
npm install
npm run dev
```

Then open the local URL shown in the terminal (usually `http://localhost:5173`).

## Linting

```bash
cd client
npm run lint
```