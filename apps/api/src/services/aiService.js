// Benchmark skill sets for target roles
const ROLE_BENCHMARKS = {
  'Full Stack Developer': ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'HTML', 'CSS', 'Git', 'REST API'],
  'Frontend Developer': ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'TypeScript', 'Redux', 'Git'],
  'Backend Developer': ['Node.js', 'Express', 'MongoDB', 'SQL', 'REST API', 'JWT', 'Docker', 'Git'],
  'AI Engineer': ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'REST API', 'Node.js', 'SQL', 'Git'],
};

export const evaluateSkillGap = (userSkills = [], targetRole = 'Full Stack Developer') => {
  const normalizedUserSkills = userSkills.map((s) => s.trim().toLowerCase());
  const benchmark = ROLE_BENCHMARKS[targetRole] || ROLE_BENCHMARKS['Full Stack Developer'];

  const matchedSkills = [];
  const missingSkills = [];

  benchmark.forEach((skill) => {
    if (normalizedUserSkills.includes(skill.toLowerCase())) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const matchPercentage = Math.round((matchedSkills.length / benchmark.length) * 100);

  // Generate dynamic 3-phase study roadmap
  const roadmap = missingSkills.slice(0, 3).map((skill, index) => ({
    phase: `Week ${index + 1}`,
    topic: `Master ${skill}`,
    action: `Build a micro-project using ${skill} and integrate it into your ${targetRole} portfolio.`,
  }));

  return {
    targetRole,
    matchPercentage,
    matchedSkills,
    missingSkills,
    roadmap: roadmap.length > 0 ? roadmap : [{ phase: 'Complete', topic: 'Role Ready', action: 'All core benchmark skills acquired! Focus on portfolio projects.' }],
    recommendations: missingSkills.map((skill) => `Add ${skill} to your learning roadmap to increase job readiness.`),
  };
};