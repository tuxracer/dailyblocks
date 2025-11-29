# dailyblocks.tv

A modern, lightweight video player for Reddit built with Vite + React. Browse and watch videos from your favorite subreddits with a clean, distraction-free interface.

## Features

- 📱 **Mobile-Friendly**: Progressive Web App (PWA) with mobile web app support
- 🔄 **Auto-Play**: Automatically play the next video when one ends
- 💬 **Comments**: View Reddit comments alongside videos
- 🖼️ **Thumbnail Navigation**: Browse through video thumbnails in a sidebar
- 🎨 **Clean UI**: Minimalist interface focused on video content

## Tech Stack

- **Framework**: React
- **Language**: TypeScript
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **Video Player**: [React Player](https://github.com/cookpete/react-player) (supports YouTube, Vimeo, and more)
- **Data Fetching**: [SWR](https://swr.vercel.app/) for efficient data fetching and caching
- **Build Tool**: [Vite](https://vite.dev/)

## Getting Started

### Prerequisites

- Node.js >= 24.0.0
- npm

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

The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot module replacement (HMR)
- `npm run build` - Create a production-ready build
- `npm run preview` - Preview the production build locally

## Usage

### Viewing Videos

Navigate to a subreddit using the URL pattern:

```
/r/{subreddit}/comments/{postId}
```

For example:

- `/r/videos/comments/abc123` - View a specific video from r/videos
- `/r/videos` - Redirects to the default/hot video from r/videos

## License

MIT License

## Author

[Derek Petersen](https://github.com/tuxracer)
