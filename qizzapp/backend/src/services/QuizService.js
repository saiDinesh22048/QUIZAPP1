import { Team } from '../models/Team.js';

export class QuizService {
  static async updateTeamScore(teamId, newScore) {
    try {
      const team = await Team.getById(teamId);
      if (!team) {
        throw new Error('Team not found');
      }

      await Team.updateScore(teamId, newScore);
      return { id: teamId, score: newScore };
    } catch (error) {
      throw error;
    }
  }

  static async getLeaderboard() {
    try {
      const teams = await Team.getAll();
      return teams.sort((a, b) => b.score - a.score);
    } catch (error) {
      throw error;
    }
  }

  static async incrementTeamScore(teamId, points = 1) {
    try {
      const team = await Team.getById(teamId);
      if (!team) {
        throw new Error('Team not found');
      }

      const newScore = team.score + points;
      await Team.updateScore(teamId, newScore);
      return { id: teamId, score: newScore };
    } catch (error) {
      throw error;
    }
  }
}
