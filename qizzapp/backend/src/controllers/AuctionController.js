import { AuctionService } from '../services/AuctionService.js';
import { Team } from '../models/Team.js';
import { Player } from '../models/Player.js';

export class AuctionController {
  static currentPlayer = null;

  static async getStatus(req, res) {
    try {
      const status = await AuctionService.getAuctionStatus();
      res.json({ success: true, data: status });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getAllPlayers(req, res) {
    try {
      const players = await Player.getAll();
      res.json({ success: true, data: players });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getAvailablePlayers(req, res) {
    try {
      const players = await Player.getAvailable();
      res.json({ success: true, data: players });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async assignPlayer(req, res) {
    try {
      const { playerId, teamId, soldPrice } = req.body;

      if (!playerId || !teamId || !soldPrice) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
      }

      const result = await AuctionService.assignPlayerToTeam(playerId, teamId, soldPrice);
      
      // Clear current player after assignment
      AuctionController.currentPlayer = null;
      req.io.emit('currentPlayerUpdate', null);
      
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async setCurrentPlayer(req, res) {
    try {
      const { playerId } = req.body;

      if (!playerId) {
        AuctionController.currentPlayer = null;
        req.io.emit('currentPlayerUpdate', null);
        return res.json({ success: true, data: null });
      }

      const player = await Player.getById(playerId);
      if (!player) {
        return res.status(404).json({ success: false, error: 'Player not found' });
      }

      AuctionController.currentPlayer = player;
      
      // Emit current player update via WebSocket
      req.io.emit('currentPlayerUpdate', player);

      res.json({ success: true, data: player });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getCurrentPlayer(req, res) {
    try {
      res.json({ success: true, data: AuctionController.currentPlayer });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async undoAuction(req, res) {
    try {
      const result = await AuctionService.undoLastAuction();
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async resetAuction(req, res) {
    try {
      const result = await AuctionService.resetAuction();
      
      // Clear current player on reset
      AuctionController.currentPlayer = null;
      req.io.emit('currentPlayerUpdate', null);
      
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async getTeams(req, res) {
    try {
      const teams = await Team.getAll();
      res.json({ success: true, data: teams });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async validateBid(req, res) {
    try {
      const { teamId, bidAmount } = req.body;

      if (!teamId || !bidAmount) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
      }

      const result = await AuctionService.validateBid(teamId, bidAmount);
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }

  static async getPlayerById(req, res) {
    try {
      const { id } = req.params;
      const player = await Player.getById(id);
      if (!player) {
        return res.status(404).json({ success: false, error: 'Player not found' });
      }
      res.json({ success: true, data: player });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getTeamPlayers(req, res) {
    try {
      const { teamId } = req.params;
      const players = await Player.getSoldByTeam(teamId);
      res.json({ success: true, data: players });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
