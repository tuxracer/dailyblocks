# CLAUDE.md

dailyblocks was a Reddit video player. It is retired and this repo is kept for reference only.

## What is live

`public/index.html` is the entire site: one static page, with inline `<style>` and `<script>`, that hands every visitor off somewhere else. A deep link such as `/r/videos` or `/r/videos/comments/abc123` gets a button to the matching place on reddit.com. The root path has no video to hand off, so it says the player is retired and why, then points at tuxbank.app: a button goes there immediately, and a ten-second countdown goes there on its own unless the visitor cancels. Both destinations carry UTM tags (`utm_content` is `button` or `countdown`) so tuxbank's Vercel Web Analytics can attribute the traffic; the tags are written once, in the button's `href`, and the countdown reads them off it. `vercel.json` serves `public/` and rewrites `/(.*)` to `/index.html`. There is no build step, no dependencies, and no `package.json`. Do not add a framework or a bundler.

Preview the page with an SPA-style fallback so deep links like `/r/videos` rewrite to `index.html` the way `vercel.json` does in production (the `--proxy` value's trailing `?` is what turns unresolved paths into a fallback; `-c-1` disables caching so edits show up on reload):

```bash
npx http-server public -p 8080 -c-1 --proxy "http://localhost:8080?"
```

A plain `npx http-server public` 404s on every path except `/`, which shows the tuxbank hand-off rather than the Reddit one. Both views live in the same file, so checking one is never enough: load `/` and a `/r/...` path after touching the markup, and remember that `/` starts a real ten-second redirect to tuxbank.app.

## The last working version

`src/` is the old React player, kept in the tree so it is easy to browse. Nothing builds, deploys, or imports it, and it cannot be built from the working tree. The tooling (`package.json`, `vite.config.ts`, tsconfigs, ESLint config) is not here, so `npm install`, `npm run build`, and `npm run lint` all fail. That is expected, not something to fix in passing. Do not edit `src/` without first restoring the build system from the `full-source` tag: with the tooling gone from this commit, changes there have no effect on anything.

The complete, buildable project lives at the `full-source` git tag, the last commit where the player worked. Do not expect it to work today, even fully restored: Reddit closed off the public JSON API and now returns HTTP 403 for every unauthenticated request the hooks make, so the app builds and runs but plays nothing. If you insist on trying anyway, this is the path, starting from the tag rather than recreating the tooling from scratch:

```bash
git checkout full-source
npm install    # requires Node.js >= 24
npm run build  # dev, lint, and preview work there too
```
