import { QuizService } from '../services/QuizService.js';
import { Player } from '../models/Player.js';

export class QuizController {
  static currentQuestion = null;
  static showAnswer = false;
  static displayedQuestions = new Set();

  static async updateScore(req, res) {
    try {
      const { teamId, score } = req.body;

      if (!teamId || score === undefined || score === null) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
      }

      const numericScore = parseInt(score);
      if (isNaN(numericScore)) {
        return res.status(400).json({ success: false, error: 'Score must be a valid number' });
      }

      const result = await QuizService.updateTeamScore(teamId, numericScore);
      
      // Get the full leaderboard and emit it via WebSocket
      const fullLeaderboard = await QuizService.getLeaderboard();
      req.io.emit('leaderboardUpdate', fullLeaderboard);
      
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async getLeaderboard(req, res) {
    try {
      const leaderboard = await QuizService.getLeaderboard();
      res.json({ success: true, data: leaderboard });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getQuestion(req, res) {
    try {
      const { playerId } = req.params;
      const player = await Player.getById(playerId);

      if (!player) {
        return res.status(404).json({ success: false, error: 'Question not found' });
      }

      res.json({
        success: true,
        data: {
          id: player.id,
          cricketer: player.cricketer_name,
          question: player.question_text,
          answer: player.answer_text,
          option_a: player.option_a,
          option_b: player.option_b,
          option_c: player.option_c,
          option_d: player.option_d,
          owner: player.team_name
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getAllQuestions(req, res) {
    try {
      const players = await Player.getAll();
      const questions = players.map(p => ({
        id: p.id,
        cricketer: p.cricketer_name,
        question: p.question_text,
        answer: p.answer_text,
        option_a: p.option_a,
        option_b: p.option_b,
        option_c: p.option_c,
        option_d: p.option_d,
        owner: p.team_name
      }));
      res.json({ success: true, data: questions });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getUndisplayedQuestions(req, res) {
    try {
      const players = await Player.getAll();
      const questions = players
        .filter(p => !QuizController.displayedQuestions.has(p.id))
        .map(p => ({
          id: p.id,
          cricketer: p.cricketer_name,
          question: p.question_text,
          answer: p.answer_text,
          option_a: p.option_a,
          option_b: p.option_b,
          option_c: p.option_c,
          option_d: p.option_d,
          owner: p.team_name
        }));
      res.json({ success: true, data: questions });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async incrementScore(req, res) {
    try {
      const { teamId, points } = req.body;

      if (!teamId) {
        return res.status(400).json({ success: false, error: 'Missing required field: teamId' });
      }

      const result = await QuizService.incrementTeamScore(teamId, points || 1);
      
      // Get the full leaderboard and emit it via WebSocket
      const fullLeaderboard = await QuizService.getLeaderboard();
      req.io.emit('leaderboardUpdate', fullLeaderboard);
      
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async sendCurrentQuestion(req, res) {
    try {
      const { playerId } = req.body;

      if (!playerId) {
        return res.status(400).json({ success: false, error: 'Missing playerId' });
      }

      const player = await Player.getById(playerId);
      if (!player) {
        return res.status(404).json({ success: false, error: 'Player not found' });
      }

      const questionData = {
        id: player.id,
        cricketer: player.cricketer_name,
        question: player.question_text,
        answer: player.answer_text,
        option_a: player.option_a,
        option_b: player.option_b,
        option_c: player.option_c,
        option_d: player.option_d,
        owner: player.team_name
      };

      QuizController.currentQuestion = questionData;
      QuizController.showAnswer = false;
      QuizController.displayedQuestions.add(playerId);

      // Emit current question via WebSocket
      req.io.emit('currentQuestionUpdate', { question: questionData, showAnswer: false });
      req.io.emit('questionDisplayed', playerId);

      res.json({ success: true, data: questionData });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async sendAnswer(req, res) {
    try {
      if (!QuizController.currentQuestion) {
        return res.status(400).json({ success: false, error: 'No current question set' });
      }

      QuizController.showAnswer = true;

      // Emit show answer via WebSocket
      req.io.emit('showAnswerUpdate', true);

      res.json({ success: true, data: { showAnswer: true } });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getCurrentQuestion(req, res) {
    try {
      res.json({
        success: true,
        data: {
          question: QuizController.currentQuestion,
          showAnswer: QuizController.showAnswer
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async resetQuiz(req, res) {
    try {
      QuizController.currentQuestion = null;
      QuizController.showAnswer = false;
      QuizController.displayedQuestions.clear();

      req.io.emit('quizReset');

      res.json({ success: true, message: 'Quiz reset successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async removeQuestion(req, res) {
    try {
      const { playerId } = req.params;

      if (!playerId) {
        return res.status(400).json({ success: false, error: 'Player ID is required' });
      }

      // Remove from displayed questions if it was displayed
      QuizController.displayedQuestions.delete(parseInt(playerId));

      // Delete the player from database
      const result = await Player.deleteById(playerId);

      if (!result) {
        return res.status(404).json({ success: false, error: 'Question not found' });
      }

      // If this was the current question, clear it
      if (QuizController.currentQuestion && QuizController.currentQuestion.id === parseInt(playerId)) {
        QuizController.currentQuestion = null;
        QuizController.showAnswer = false;
        req.io.emit('currentQuestionUpdate', { question: null, showAnswer: false });
      }

      res.json({ success: true, message: 'Question removed successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
