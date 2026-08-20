# CLAUDE.md

dailyblocks was a Reddit video player. It is retired and this repo is kept for reference only.

## What is live

`public/index.html` is the entire site: one static page, with inline `<style>` and `<script>`, that hands every visitor off to reddit.com. A deep link such as `/r/videos` or `/r/videos/comments/abc123` gets a button to the matching place there. Every other path, the root included, gets a button to `/r/videos`, the listing the player opened on. Nothing on the page moves on its own and nothing redirects. `vercel.json` serves `public/` and rewrites `/(.*)` to `/index.html`. There is no build step, no dependencies, and no `package.json`. Do not add a framework or a bundler.

**The page carries no comments, in any language**: no `<!-- -->`, no `/* */`, no `//`. It is the one file every visitor downloads in full on every request, and nothing strips anything on the way out, so a comment written there is shipped to every reader of the page for as long as the page exists. Explanations go in the section below instead, where the next person editing the markup will actually read them.

Preview the page with an SPA-style fallback so deep links like `/r/videos` rewrite to `index.html` the way `vercel.json` does in production (the `--proxy` value's trailing `?` is what turns unresolved paths into a fallback; `-c-1` disables caching so edits show up on reload):

```bash
npx http-server public -p 8080 -c-1 --proxy "http://localhost:8080?"
```

A plain `npx http-server public` 404s on every path except `/`. Every path renders the same markup, so `/` is enough to check the layout, but load a `/r/...` path too after touching the script: where the button points is the only thing the path decides.

## How the page works

**One page, every path.** There is no view switching and no class on `<html>`: every path renders the same markup, and a module script rewrites the button's `href` at load. With JavaScript off the button keeps the `/r/videos` written into the markup, which is where an unrecognised path would have sent the visitor anyway, so nothing on the page is ever dead.

**Outbound tags.** The project links carry UTM tags so the site on the other end can attribute the traffic. Both are written out in full in the markup rather than tagged by script, so they arrive tagged with JavaScript off as well; there are only two of them, and a shared campaign spelled twice is cheaper to read than the code that would spell it once. Vercel Web Analytics reads all five UTM parameters as its own dimensions, so this needs nothing on the receiving project. Outbound links to my own projects deliberately carry no `rel="noreferrer"`, so those sites see `dailyblocks.tv` as the referrer as well; `target="_blank"` still implies `noopener` in every current browser, so dropping the attribute gives the opened page nothing. The `Source on GitHub` links keep theirs.

**The Reddit route pattern.** `ROUTE` matches the two shapes the player used to serve as one pattern, the post branch first and then the bare listing. `subreddit` is a named group in both branches, which is legal because only one of them can match. Anything else, `/` included, falls back to `/r/videos`, and a bare post id is enough because Reddit expands it into the full permalink, so the title slug does not have to be carried over. The captures are the only part of the URL that reaches the link, and `\w` keeps them to the characters subreddit names and post ids are made of. They never reach the copy either, so the page cannot be used to display arbitrary text under this domain. Keep it that way.

## The last working version

`src/` is the old React player, kept in the tree so it is easy to browse. Nothing builds, deploys, or imports it, and it cannot be built from the working tree. The tooling (`package.json`, `vite.config.ts`, tsconfigs, ESLint config) is not here, so `npm install`, `npm run build`, and `npm run lint` all fail. That is expected, not something to fix in passing. Do not edit `src/` without first restoring the build system from the `full-source` tag: with the tooling gone from this commit, changes there have no effect on anything.

The complete, buildable project lives at the `full-source` git tag, the last commit where the player worked. Do not expect it to work today, even fully restored: Reddit closed off the public JSON API and now returns HTTP 403 for every unauthenticated request the hooks make, so the app builds and runs but plays nothing. If you insist on trying anyway, this is the path, starting from the tag rather than recreating the tooling from scratch:

```bash
git checkout full-source
npm install    # requires Node.js >= 24
npm run build  # dev, lint, and preview work there too
```
