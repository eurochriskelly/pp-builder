const { apiRequest } = require('../../api');

async function getCardedPlayers(tournamentId) {
    const data = await apiRequest('get', `/tournaments/${tournamentId}/carded-players`);
    return data.map(player => ({
        playerNumber: player.playerId || 'N/A',
        playerName: `${player.firstName || ''} ${player.secondName || ''}`.trim() || 'N/A',
        team: player.team || 'N/A',
        cardColor: player.cardColor || 'N/A',
    }));
}

module.exports = { getCardedPlayers };
