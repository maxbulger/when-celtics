# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"When Celtics?" is a single-page web application that displays the next upcoming Boston Celtics NBA game. It's a pure client-side application with no build system - just vanilla HTML, CSS, and JavaScript.

## Architecture

### Core Components

- **index.html**: Main application entry point with semantic HTML structure
- **script.js**: All application logic including API integration, date/time formatting, and UI state management
- **style.css**: Responsive styling with Celtics brand colors (green #007A33 and gold #BA9653)
- **test.html**: Minimal test harness for verifying game finding logic

### Data Flow

1. On page load, `fetchCelticsGames()` attempts to fetch from NBA's live scoreboard API
2. If the API fails or returns no Celtics games, falls back to `getSampleUpcomingGame()` with hardcoded sample data
3. `findNextGame()` filters games to find the next upcoming game after current time
4. `displayGameInfo()` updates the DOM with opponent, date/time, and location

### Key Design Decisions

**No Build System**: This is intentional - the app is designed to be deployable as static files with no compilation step.

**Fallback Data Strategy**: The app includes sample game data (`getSampleUpcomingGame()`) that activates when:
- NBA API is unreachable
- API response is malformed
- No games are found for today

**Team Logo Mapping**: The `teamLogos` object (script.js:4-39) maps team names to NBA CDN logo URLs. It includes both full names ("Los Angeles Lakers") and short names ("Lakers", "76ers") for flexible matching.

**State Management**: Uses simple show/hide pattern with three UI states:
- Loading state: spinner displayed
- Game info state: game card displayed
- Error state: retry button displayed

## Development

### Testing Locally

Open `index.html` directly in a browser - no server required:
```bash
open index.html
```

For live reload during development, use any static file server:
```bash
python -m http.server 8000
# or
npx serve
```

### Testing Logic

Open `test.html` to verify the game finding algorithm with sample data.

## Key Constants

- `CELTICS_TEAM_ID`: '1610612738' - NBA's official team ID for the Celtics
- Domain: whenceltics.com (referenced in Open Graph meta tags)
- Colors: Celtics green (#007A33) and gold (#BA9653)

## API Integration

**Current API**: `https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json`

This endpoint returns all NBA games for the current day. The app filters for games where either `homeTeam.teamId` or `awayTeam.teamId` matches the Celtics team ID.

**Data Transform**: NBA API response is normalized to internal format:
```javascript
{
  date: game.gameTimeUTC,
  home_team: { id, city, name },
  visitor_team: { id, city, name }
}
```

## Making Changes

When modifying this codebase:

1. **No Dependencies**: Keep the zero-dependency philosophy - don't introduce npm packages or build tools
2. **Logo Updates**: When adding/fixing team logos, update the `teamLogos` object in script.js
3. **API Changes**: If NBA changes their API structure, update the transform logic in `fetchCelticsGames()`
4. **Sample Data**: Keep `getSampleUpcomingGame()` in sync with actual API response structure for reliable fallback
