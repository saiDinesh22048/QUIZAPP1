import express from 'express';
import { QuizController } from '../controllers/QuizController.js';

const router = express.Router();

router.get('/leaderboard', QuizController.getLeaderboard);
router.get('/questions/:playerId', QuizController.getQuestion);
router.get('/questions', QuizController.getAllQuestions);
router.get('/questions/undisplayed', QuizController.getUndisplayedQuestions);
router.get('/current-question', QuizController.getCurrentQuestion);

router.post('/score', QuizController.updateScore);
router.post('/score/increment', QuizController.incrementScore);
router.post('/send-question', QuizController.sendCurrentQuestion);
router.post('/send-answer', QuizController.sendAnswer);
router.post('/reset', QuizController.resetQuiz);

router.delete('/questions/:playerId', QuizController.removeQuestion);

export default router;
