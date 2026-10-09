import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/user.js';
import { evaluateSkillGap } from '../services/aiService.js';
import { generateInterviewQuestions } from '../services/interviewService.js';
import { parseAndAnalyzeResume } from '../services/resumeService.js';

const router = express.Router();

// GET /api/career/analyze - Skill gap analysis & roadmap
router.get('/analyze', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const analysis = evaluateSkillGap(user.skills, user.targetRole);
    res.json(analysis);
  } catch (error) {
    console.error('Career analysis error:', error);
    res.status(500).json({ message: 'Server error generating skill analysis' });
  }
});

// GET /api/career/interview-prep - Role-specific interview practice
router.get('/interview-prep', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const prep = generateInterviewQuestions(user.targetRole, user.experienceLevel);
    res.json(prep);
  } catch (error) {
    console.error('Interview prep error:', error);
    res.status(500).json({ message: 'Server error generating interview questions' });
  }
});


// POST /api/career/analyze-resume - Resume text & ATS match analysis
router.post('/analyze-resume', protect, async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    if (!resumeText) {
      return res.status(400).json({ message: 'Resume text is required for analysis' });
    }

    const result = parseAndAnalyzeResume(resumeText, jobDescription);
    res.json(result);
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ message: 'Server error analyzing resume' });
  }
});

export default router;