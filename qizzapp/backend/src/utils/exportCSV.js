import { Team } from '../models/Team.js';
import { Player } from '../models/Player.js';

export async function generateAuctionResultsCSV() {
  try {
    const teams = await Team.getAll();
    const players = await Player.getAll();

    let csv = 'Auction Results\n\n';

    // Teams summary
    csv += 'Team,Initial Purse,Remaining Purse,Players Owned,Players Sold Count,Score\n';
    teams.forEach(team => {
      csv += `${team.name},${team.initial_purse},${team.remaining_purse},${team.players_count},${team.score}\n`;
    });

    csv += '\n\nSold Players\n';
    csv += 'Player Name,Question,Answer,Base Price,Sold Price,Sold To Team\n';

    const soldPlayers = players.filter(p => p.status === 'SOLD');
    soldPlayers.forEach(player => {
      csv += `${player.cricketer_name},"${player.question_text}","${player.answer_text}",${player.base_price},${player.sold_price},${player.team_name}\n`;
    });

    csv += '\n\nAvailable Players\n';
    csv += 'Player Name,Question,Answer,Base Price\n';

    const availablePlayers = players.filter(p => p.status === 'AVAILABLE');
    availablePlayers.forEach(player => {
      csv += `${player.cricketer_name},"${player.question_text}","${player.answer_text}",${player.base_price}\n`;
    });

    return csv;
  } catch (error) {
    throw error;
  }
}

export async function generateQuizResultsCSV() {
  try {
    const leaderboard = await Team.getAll();

    let csv = 'Quiz Results - Leaderboard\n\n';
    csv += 'Rank,Team,Score,Players,Remaining Purse\n';

    const sorted = leaderboard.sort((a, b) => b.score - a.score);
    sorted.forEach((team, index) => {
      csv += `${index + 1},${team.name},${team.score},${team.players_count},${team.remaining_purse}\n`;
    });

    return csv;
  } catch (error) {
    throw error;
  }
}
