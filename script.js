const CELTICS_TEAM_ID = '1610612738';
const NBA_API_BASE_URL = 'https://stats.nba.com/stats';

const teamLogos = {
    'Atlanta Hawks': 'https://cdn.nba.com/logos/nba/1610612737/primary/L/logo.svg',
    'Boston Celtics': 'https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg',
    'Brooklyn Nets': 'https://cdn.nba.com/logos/nba/1610612751/primary/L/logo.svg',
    'Charlotte Hornets': 'https://cdn.nba.com/logos/nba/1610612766/primary/L/logo.svg',
    'Chicago Bulls': 'https://cdn.nba.com/logos/nba/1610612741/primary/L/logo.svg',
    'Cleveland Cavaliers': 'https://cdn.nba.com/logos/nba/1610612739/primary/L/logo.svg',
    'Dallas Mavericks': 'https://cdn.nba.com/logos/nba/1610612742/primary/L/logo.svg',
    'Denver Nuggets': 'https://cdn.nba.com/logos/nba/1610612743/primary/L/logo.svg',
    'Detroit Pistons': 'https://cdn.nba.com/logos/nba/1610612765/primary/L/logo.svg',
    'Golden State Warriors': 'https://cdn.nba.com/logos/nba/1610612744/primary/L/logo.svg',
    'Houston Rockets': 'https://cdn.nba.com/logos/nba/1610612745/primary/L/logo.svg',
    'Indiana Pacers': 'https://cdn.nba.com/logos/nba/1610612754/primary/L/logo.svg',
    'LA Clippers': 'https://cdn.nba.com/logos/nba/1610612746/primary/L/logo.svg',
    'Los Angeles Lakers': 'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg',
    'Memphis Grizzlies': 'https://cdn.nba.com/logos/nba/1610612763/primary/L/logo.svg',
    'Miami Heat': 'https://cdn.nba.com/logos/nba/1610612748/primary/L/logo.svg',
    'Milwaukee Bucks': 'https://cdn.nba.com/logos/nba/1610612749/primary/L/logo.svg',
    'Minnesota Timberwolves': 'https://cdn.nba.com/logos/nba/1610612750/primary/L/logo.svg',
    'New Orleans Pelicans': 'https://cdn.nba.com/logos/nba/1610612740/primary/L/logo.svg',
    'New York Knicks': 'https://cdn.nba.com/logos/nba/1610612752/primary/L/logo.svg',
    'Oklahoma City Thunder': 'https://cdn.nba.com/logos/nba/1610612760/primary/L/logo.svg',
    'Orlando Magic': 'https://cdn.nba.com/logos/nba/1610612753/primary/L/logo.svg',
    'Philadelphia 76ers': 'https://cdn.nba.com/logos/nba/1610612755/primary/L/logo.svg',
    'Phoenix Suns': 'https://cdn.nba.com/logos/nba/1610612756/primary/L/logo.svg',
    'Portland Trail Blazers': 'https://cdn.nba.com/logos/nba/1610612757/primary/L/logo.svg',
    'Sacramento Kings': 'https://cdn.nba.com/logos/nba/1610612758/primary/L/logo.svg',
    'San Antonio Spurs': 'https://cdn.nba.com/logos/nba/1610612759/primary/L/logo.svg',
    'Toronto Raptors': 'https://cdn.nba.com/logos/nba/1610612761/primary/L/logo.svg',
    'Utah Jazz': 'https://cdn.nba.com/logos/nba/1610612762/primary/L/logo.svg',
    'Washington Wizards': 'https://cdn.nba.com/logos/nba/1610612764/primary/L/logo.svg',
    'Lakers': 'https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg',
    'Knicks': 'https://cdn.nba.com/logos/nba/1610612752/primary/L/logo.svg',
    '76ers': 'https://cdn.nba.com/logos/nba/1610612755/primary/L/logo.svg',
    'Celtics': 'https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg'
};

function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('game-info').classList.add('hidden');
    document.getElementById('error').classList.add('hidden');
}

function showError() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('game-info').classList.add('hidden');
    document.getElementById('error').classList.remove('hidden');
}

function showGameInfo() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('game-info').classList.remove('hidden');
    document.getElementById('error').classList.add('hidden');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
}

function formatTime(dateString) {
    const date = new Date(dateString);
    const options = {
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short'
    };
    return date.toLocaleTimeString('en-US', options);
}

function getOpponentTeam(game) {
    if (game.home_team.id === CELTICS_TEAM_ID) {
        return game.visitor_team;
    } else {
        return game.home_team;
    }
}

function getGameLocation(game) {
    if (game.home_team.id === CELTICS_TEAM_ID) {
        return 'TD Garden, Boston';
    } else {
        return `${game.home_team.city}, ${game.home_team.name}`;
    }
}

function displayGameInfo(game) {
    const opponent = getOpponentTeam(game);
    const location = getGameLocation(game);

    document.getElementById('opponent-name').textContent = opponent.name;

    const fullTeamName = `${opponent.city} ${opponent.name}`;
    const logoUrl = teamLogos[fullTeamName] || teamLogos[opponent.name] || '';

    console.log('Looking for logo for:', fullTeamName, 'Found:', logoUrl);

    document.getElementById('opponent-logo').src = logoUrl;
    document.getElementById('opponent-logo').alt = fullTeamName;

    if (!logoUrl) {
        document.getElementById('opponent-logo').style.display = 'none';
    } else {
        document.getElementById('opponent-logo').style.display = 'block';
    }

    document.getElementById('game-date').textContent = formatDate(game.date);
    document.getElementById('game-time').textContent = formatTime(game.date);
    document.getElementById('game-location').textContent = location;

    showGameInfo();
}

async function fetchCelticsGames() {
    try {
        const response = await fetch('https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const celticsGames = data.scoreboard.games.filter(game =>
            game.homeTeam.teamId === CELTICS_TEAM_ID ||
            game.awayTeam.teamId === CELTICS_TEAM_ID
        );

        if (celticsGames.length > 0) {
            return celticsGames.map(game => ({
                date: game.gameTimeUTC,
                home_team: {
                    id: game.homeTeam.teamId,
                    city: game.homeTeam.teamCity,
                    name: game.homeTeam.teamName
                },
                visitor_team: {
                    id: game.awayTeam.teamId,
                    city: game.awayTeam.teamCity,
                    name: game.awayTeam.teamName
                }
            }));
        }

        return getSampleUpcomingGame();
    } catch (error) {
        console.error('Error fetching from NBA API, using sample data:', error);
        return getSampleUpcomingGame();
    }
}

function getSampleUpcomingGame() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(20, 0, 0, 0);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(19, 30, 0, 0);

    const twoWeeks = new Date();
    twoWeeks.setDate(twoWeeks.getDate() + 14);
    twoWeeks.setHours(20, 0, 0, 0);

    const sampleGames = [
        {
            date: tomorrow.toISOString(),
            home_team: {
                id: '1610612738',
                city: 'Boston',
                name: 'Celtics'
            },
            visitor_team: {
                id: '1610612747',
                city: 'Los Angeles',
                name: 'Lakers'
            }
        },
        {
            date: nextWeek.toISOString(),
            home_team: {
                id: '1610612752',
                city: 'New York',
                name: 'Knicks'
            },
            visitor_team: {
                id: '1610612738',
                city: 'Boston',
                name: 'Celtics'
            }
        },
        {
            date: twoWeeks.toISOString(),
            home_team: {
                id: '1610612738',
                city: 'Boston',
                name: 'Celtics'
            },
            visitor_team: {
                id: '1610612755',
                city: 'Philadelphia',
                name: '76ers'
            }
        }
    ];

    return sampleGames;
}

function findNextGame(games) {
    const now = new Date();

    const upcomingGames = games.filter(game => {
        const gameDate = new Date(game.date);
        return gameDate > now;
    });

    if (upcomingGames.length === 0) {
        return null;
    }

    upcomingGames.sort((a, b) => new Date(a.date) - new Date(b.date));
    return upcomingGames[0];
}

async function loadNextGame() {
    showLoading();

    try {
        console.log('Fetching Celtics games...');
        const games = await fetchCelticsGames();
        console.log('Games fetched:', games);

        const nextGame = findNextGame(games);
        console.log('Next game found:', nextGame);

        if (nextGame) {
            displayGameInfo(nextGame);
        } else {
            console.error('No upcoming games found');
            throw new Error('No upcoming games found');
        }
    } catch (error) {
        console.error('Error loading next game:', error);
        showError();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadNextGame();
});