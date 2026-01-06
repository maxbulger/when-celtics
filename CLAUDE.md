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

1. On page load, `fetchCelticsSchedule()` attempts to fetch the full season schedule from NBA's static data API
2. If the schedule API fails, falls back to `fetchTodaysScoreboard()` which checks today's live scoreboard
3. If both APIs fail, falls back to `getSampleUpcomingGame()` with dynamically-generated sample data
4. `findNextGame()` filters games to find the next upcoming game after current time
5. `displayGameInfo()` updates the DOM with opponent, date/time, location, and current record

### Key Design Decisions

**No Build System**: This is intentional - the app is designed to be deployable as static files with no compilation step.

**Fallback Strategy**: The app has a three-tier fallback system:
1. Primary: Full season schedule API (finds next game regardless of date)
2. Secondary: Today's scoreboard API (for live record data when schedule fails)
3. Tertiary: Dynamically-generated sample data with future dates

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

**Primary API**: `https://cdn.nba.com/static/json/staticData/scheduleLeagueV2.json`

This endpoint contains the full season schedule with all games. The app:
- Iterates through `leagueSchedule.gameDates[]` array
- Filters for games where either `homeTeam.teamId` or `awayTeam.teamId` matches the Celtics team ID (1610612738)
- Extracts wins/losses from the Celtics team object for the current record

**Fallback API**: `https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json`

Used when the schedule API fails. Returns today's games with live scores and current records.

**Data Transform**: Both APIs are normalized to internal format:
```javascript
{
  date: game.gameDateTimeUTC || game.gameTimeUTC,
  home_team: { id, city, name },
  visitor_team: { id, city, name },
  celtics_record: { wins, losses }
}
```

## Making Changes

When modifying this codebase:

1. **No Dependencies**: Keep the zero-dependency philosophy - don't introduce npm packages or build tools
2. **Logo Updates**: When adding/fixing team logos, update the `teamLogos` object in script.js
3. **API Changes**: If NBA changes their API structure, update the transform logic in `fetchCelticsGames()`
4. **Sample Data**: Keep `getSampleUpcomingGame()` in sync with actual API response structure for reliable fallback
