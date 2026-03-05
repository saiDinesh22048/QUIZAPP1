import express from 'express';
import { AuctionController } from '../controllers/AuctionController.js';

const router = express.Router();

router.get('/status', AuctionController.getStatus);
router.get('/players', AuctionController.getAllPlayers);
router.get('/players/available', AuctionController.getAvailablePlayers);
router.get('/players/:id', AuctionController.getPlayerById);
router.get('/teams', AuctionController.getTeams);
router.get('/teams/:teamId/players', AuctionController.getTeamPlayers);
router.get('/current-player', AuctionController.getCurrentPlayer);

router.post('/assign', AuctionController.assignPlayer);
router.post('/validate-bid', AuctionController.validateBid);
router.post('/undo', AuctionController.undoAuction);
router.post('/reset', AuctionController.resetAuction);
router.post('/set-current-player', AuctionController.setCurrentPlayer);

export default router;
