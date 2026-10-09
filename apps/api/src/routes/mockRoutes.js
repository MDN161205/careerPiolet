import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { startMockSession, evaluateAnswer } from '../services/mockInterviewService.js';

const router = express.Router();

// POST /api/mock/start - Initialize mock interview
router.post('/start', protect, (req, res) => {
  try {
    const { targetRole } = req.body;
    const session = startMockSession(targetRole || req.user.targetRole);
    res.json(session);
  } catch (error) {
    console.error('Mock interview start error:', error);
    res.status(500).json({ message: 'Error starting mock interview session' });
  }
});

// POST /api/mock/evaluate - Submit answer for live AI scoring
router.post('/evaluate', protect, (req, res) => {
  try {
    const { targetRole, questionId, userAnswer } = req.body;
    if (!userAnswer || !userAnswer.trim()) {
      return res.status(400).json({ message: 'Answer text is required' });
    }

    const result = evaluateAnswer(targetRole || req.user.targetRole, questionId, userAnswer);
    res.json(result);
  } catch (error) {
    console.error('Mock interview evaluation error:', error);
    res.status(500).json({ message: 'Error evaluating answer' });
  }
});

export default router;