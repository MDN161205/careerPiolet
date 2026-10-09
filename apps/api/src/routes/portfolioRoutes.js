import express from 'express';
import User from '../models/user.js';
import { evaluateSkillGap } from '../services/aiService.js';

const router = express.Router();

// @desc    Get public candidate portfolio by username (No Auth Required)
// @route   GET /api/portfolio/:username
router.get('/:username', async (req, res) => {
  try {
    const username = req.params.username.toLowerCase().trim();
    const user = await User.findOne({ username }).select('-password -email');

    if (!user) {
      return res.status(404).json({ message: 'Public portfolio not found' });
    }

    const readinessAnalysis = evaluateSkillGap(user.skills, user.targetRole);

    res.json({
      name: user.name,
      username: user.username,
      targetRole: user.targetRole,
      skills: user.skills,
      experienceLevel: user.experienceLevel,
      bio: user.bio,
      readinessScore: readinessAnalysis.matchPercentage,
      matchedSkills: readinessAnalysis.matchedSkills,
    });
  } catch (error) {
    console.error('Error fetching public portfolio:', error);
    res.status(500).json({ message: 'Server error retrieving portfolio' });
  }
});

export default router;