# CLAUDE.md

dailyblocks was a Reddit video player. It is retired and this repo is kept for reference only.

## What is live

`public/index.html` is the entire site: one static page, with inline `<style>` and `<script>`, that hands every visitor off somewhere else. A deep link such as `/r/videos` or `/r/videos/comments/abc123` gets a button to the matching place on reddit.com. The root path has no video to hand off, so it says the player is retired and why, then points at tuxbank.app: a button goes there immediately, and a ten-second countdown goes there on its own unless the visitor cancels. `vercel.json` serves `public/` and rewrites `/(.*)` to `/index.html`. There is no build step, no dependencies, and no `package.json`. Do not add a framework or a bundler.

**The page carries no comments, in any language**: no `<!-- -->`, no `/* */`, no `//`. It is the one file every visitor downloads in full on every request, and nothing strips anything on the way out, so a comment written there is shipped to every reader of the page for as long as the page exists. Explanations go in the section below instead, where the next person editing the markup will actually read them.

Preview the page with an SPA-style fallback so deep links like `/r/videos` rewrite to `index.html` the way `vercel.json` does in production (the `--proxy` value's trailing `?` is what turns unresolved paths into a fallback; `-c-1` disables caching so edits show up on reload):

```bash
npx http-server public -p 8080 -c-1 --proxy "http://localhost:8080?"
```

A plain `npx http-server public` 404s on every path except `/`, which shows the tuxbank hand-off rather than the Reddit one. Both views live in the same file, so checking one is never enough: load `/` and a `/r/...` path after touching the markup, and remember that `/` starts a real ten-second redirect to tuxbank.app.

## How the page works

**Two views, one file.** A classic script in the `<head>` picks between them before first paint: the root path puts `is-counting` on `<html>`, every other path puts `is-handoff`. The CSS hides with `:not()` rather than showing, so each element keeps its own display value. No class at all is the root view, which is what a visitor with JavaScript off sees on every path, and that is deliberate: the Reddit button cannot know which subreddit or post to point at without the script, so a dead button would be worse than the retirement notice.

**The countdown.** The ring is two SVG circles whose sweep is an animated `stroke-dashoffset`; 106.81 is the circumference of the `r=17` circle, so one full dash covers it and the animation empties it. The head script is what starts that animation, which keeps the sweep and the JavaScript timers in the same frame. Under `prefers-reduced-motion` the same animation runs on `steps(10, start)`, so it ticks instead of sweeping. `.countdown` stays `display: none` until `is-counting` reveals it, so a visitor without JavaScript is never promised a redirect that cannot happen and the button above it still works. Cancel hides the whole row again rather than reporting what it did: the countdown stopping is the only thing that was going to happen, and a line of text sitting where it used to be says less than the empty space. Because that removes the element the visitor just activated, cancelling moves focus to the button above, which is the action left on the page. The redirect is `location.replace`, never `assign` or an `href` write: that keeps this page out of the session history, so coming back from tuxbank lands wherever the visitor was before rather than on a page that immediately sends them away again.

**The project list belongs to the Reddit view alone.** The root path is already pointing at one place and leaving for it, so a second list of somewhere else to go only competes with that.

**Outbound tags.** Every link off the page carries UTM tags so the site on the other end can attribute the traffic, with `utm_content` naming the way out (`button`, `countdown`, `project-list`). The campaign is written once, in the tuxbank button's `href`, because that is the only link that has to arrive tagged with JavaScript off; the countdown and the project links copy those tags at load and override `utm_content`. Vercel Web Analytics reads all five UTM parameters as its own dimensions, so this needs nothing on the receiving project. Outbound links to my own projects deliberately carry no `rel="noreferrer"`, so those sites see `dailyblocks.tv` as the referrer as well; `target="_blank"` still implies `noopener` in every current browser, so dropping the attribute gives the opened page nothing. The `Source on GitHub` links keep theirs.

**The Reddit route pattern.** `ROUTE` matches the two shapes the player used to serve as one pattern, the post branch first and then the bare listing. `subreddit` is a named group in both branches, which is legal because only one of them can match. Anything else hands off to reddit.com itself, the way the old router treated paths it had no route for, and a bare post id is enough because Reddit expands it into the full permalink, so the title slug does not have to be carried over. The captures are the only part of the URL that reaches the link, and `\w` keeps them to the characters subreddit names and post ids are made of. They never reach the copy either, so the page cannot be used to display arbitrary text under this domain. Keep it that way.

## The last working version

`src/` is the old React player, kept in the tree so it is easy to browse. Nothing builds, deploys, or imports it, and it cannot be built from the working tree. The tooling (`package.json`, `vite.config.ts`, tsconfigs, ESLint config) is not here, so `npm install`, `npm run build`, and `npm run lint` all fail. That is expected, not something to fix in passing. Do not edit `src/` without first restoring the build system from the `full-source` tag: with the tooling gone from this commit, changes there have no effect on anything.

The complete, buildable project lives at the `full-source` git tag, the last commit where the player worked. Do not expect it to work today, even fully restored: Reddit closed off the public JSON API and now returns HTTP 403 for every unauthenticated request the hooks make, so the app builds and runs but plays nothing. If you insist on trying anyway, this is the path, starting from the tag rather than recreating the tooling from scratch:

```bash
git checkout full-source
npm install    # requires Node.js >= 24
npm run build  # dev, lint, and preview work there too
```
