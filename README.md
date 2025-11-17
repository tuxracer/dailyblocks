# dailyblocks.tv

A modern, lightweight video player for Reddit built with Preact. Browse and watch videos from your favorite subreddits with a clean, distraction-free interface.

## Features

-   🎥 **Video Player**: Watch Reddit videos with synchronized audio playback
-   📱 **Mobile-Friendly**: Progressive Web App (PWA) with mobile web app support
-   🔄 **Auto-Play**: Automatically play the next video when one ends
-   💬 **Comments**: View Reddit comments alongside videos
-   🖼️ **Thumbnail Navigation**: Browse through video thumbnails in a sidebar
-   ✅ **Watch History**: Tracks which videos you've already watched
-   🔗 **Share Links**: Generate shareable links for specific videos
-   ⚡ **Fast & Lightweight**: Built with Preact for optimal performance
-   🎨 **Clean UI**: Minimalist interface focused on video content

## Tech Stack

-   **Framework**: [Preact](https://preactjs.com/) - Fast 3kB alternative to React
-   **Language**: TypeScript
-   **Routing**: Preact Router
-   **Video Player**: React Player (supports YouTube, Vimeo, and more)
-   **Data Fetching**: SWR for efficient data fetching and caching
-   **Build Tool**: Preact CLI

## Getting Started

### Prerequisites

-   Node.js >= 16.0.0
-   npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/tuxracer/dailyblocks.git
cd dailyblocks
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## Available Scripts

-   `npm run dev` - Start development server with hot module replacement (HMR)
-   `npm run build` - Create a production-ready build
-   `npm run serve` - Serve the production build locally (port 8080)
-   `npm run lint` - Lint TypeScript files using ESLint
-   `npm run test` - Run tests with Jest and Enzyme

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Player/         # Video player component
│   ├── Thumbnails/     # Thumbnail navigation
│   ├── Comments/       # Reddit comments display
│   └── Toolbar/        # Navigation toolbar
├── pages/              # Page components
│   ├── subreddit/      # Main subreddit video page
│   └── ShareRedirect/  # Share link redirect handler
├── services/           # API services
│   └── reddit/         # Reddit API integration
├── hooks/              # Custom React hooks
├── models/             # Data models
└── common/             # Shared utilities and constants
```

## Usage

### Viewing Videos

Navigate to a subreddit using the URL pattern:

```
/r/{subreddit}/comments/{postId}
```

For example:

-   `/r/videos/comments/abc123` - View a specific video from r/videos
-   `/r/videos` - Redirects to the default/hot video from r/videos

### Share Links

Generate shareable links using:

```
/s/{postId}
```

## Development

This project uses:

-   **ESLint** for code linting
-   **Prettier** for code formatting
-   **Husky** for git hooks
-   **lint-staged** for pre-commit linting

Code is automatically formatted and linted before commits.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Author

Derek Petersen

---

For detailed information about Preact CLI, check out the [Preact CLI documentation](https://github.com/developit/preact-cli/blob/master/README.md).
