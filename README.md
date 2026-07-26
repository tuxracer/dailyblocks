# ⚠️ Deprecated

_Reddit now returns HTTP 403 for all requests. This project depended on Reddit allowing unauthenticated requests from arbitrary hosts which appears to no longer be the case._

## dailyblocks.tv

Dailyblocks was a lightweight video player for Reddit built with Vite + React. It is retired, and the site is now a single static page that hands visitors off to reddit.com.

## What gets deployed

```
public/
├── index.html   # the entire site: markup, styles, and a little JavaScript
└── favicon.ico
vercel.json      # serve public/ with no build step, rewrite every path to index.html
```

No build, no dependencies, no `package.json`. `public/index.html` is what gets served.

### The page

Every path the player used to serve now renders the same page. Its "Continue on Reddit" link is `reddit.com` in the markup and gets narrowed by the inline script to match the path being visited, so it still works without JavaScript:

| Path                               | Link                                   |
| ---------------------------------- | -------------------------------------- |
| `/r/{sub}/comments/{postId}/{...}` | `reddit.com/r/{sub}/comments/{postId}` |
| `/r/{sub}`                         | `reddit.com/r/{sub}`                   |
| anything else                      | `reddit.com`                           |

Only the subreddit name and post id are carried over, and neither is ever written into the page copy.

Clicks are reported to Vercel Web Analytics as the `continue_on_reddit` and `other_project_click` custom events. Web Analytics loads from the platform-served `/_vercel/insights/script.js` instead of the npm package.

## The original player

`src/` is the React source, kept so the code is easy to browse for anyone curious about how the app worked.

It is dead code. Nothing builds it, nothing deploys it, and nothing on the live site touches it. The tooling it needs (`package.json`, `package-lock.json`, `vite.config.ts`, the tsconfigs, the ESLint config) was removed from the latest commit, so it will not run as-is. All of it is still in this repo at the `full-source` tag.

It is restored verbatim from the `full-source` tag, the last commit where the player still worked against Reddit's API:

```bash
git show full-source          # the commit it came from
git checkout full-source      # the whole project, tooling included, as it shipped
```

Later commits gradually hollowed the player out into the deprecation notice; `ded33bc` is the last one that has `src/` in that half-retired state.

### How it worked

- **TanStack Router** with file-based routing in `src/routes/`, route tree generated into `src/routeTree.gen.ts`
- **SWR** hooks in `src/hooks/` wrapping Reddit's public JSON API, with `src/utils/reddit.ts` doing the fetching and `src/models/` parsing the responses
- **react-player** for playback, with posts filtered down to playable media by `ReactPlayer.canPlay()`
- **WatchedVideosHistoryContext** tracking watched videos in localStorage so `/` could land on the first unwatched one
- **Tailwind CSS v4** for styling

## Developing

Serve the deployed directory:

```bash
npx http-server public -p 8080 -c-1 --proxy "http://localhost:8080?"
```

Path-specific links need the rewrite that `vercel.json` provides in production, so use `vercel dev` to exercise those locally.

## License

MIT License

## Author

[Derek Petersen](https://github.com/tuxracer)
