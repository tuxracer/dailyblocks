# Unused source, kept for reference

This is the source of the dailyblocks React player. Nothing here runs.

The app was deprecated when Reddit closed off the public JSON API it depended on, and dailyblocks.tv was replaced by a single static page, [`../public/index.html`](../public/index.html). That page is the entire live site.

This directory is kept so the code is easy to browse for anyone curious about how the app worked. Nothing builds it, deploys it, or imports it. The tooling it needs (`package.json`, `package-lock.json`, `vite.config.ts`, the tsconfigs, the ESLint config) was removed from the latest commit, so it will not typecheck, lint, or run from here. All of it is still in this repo at the `full-source` tag.

## Building the last working version

Check out the `full-source` tag, which has this source plus the tooling exactly as it shipped:

```bash
git checkout full-source
npm install
npm run dev
```

Requires Node.js >= 24. `npm run build`, `npm run lint`, and `npm run preview` work there too. That leaves you on a detached HEAD; `git switch -` comes back.

It still will not play anything. Reddit now returns HTTP 403 for the unauthenticated requests every hook in `hooks/` makes, so no videos load.

## Layout

```
routes/       # file-based routes (TanStack Router), tree generated into routeTree.gen.ts
components/   # Comments and Thumbnails
hooks/        # SWR hooks over Reddit's JSON API
models/       # RedditPost and RedditComment, parsing the API responses
contexts/     # WatchedVideosHistoryContext, watched videos in localStorage
utils/        # Reddit fetching and URL helpers
main.tsx      # entry point
```

Routes map to URLs by filename: `r.$subreddit.index.tsx` is `/r/{subreddit}`, `$` prefixes are parameters, and a trailing `$` is a catch-all. `/` picked the first unwatched video in r/videos, `/r/{subreddit}` the first video in that subreddit, and `/r/{subreddit}/comments/{postId}/*` was the player page.
