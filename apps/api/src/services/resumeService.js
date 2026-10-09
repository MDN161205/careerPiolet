const CORE_KEYWORDS = [
  'React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'TypeScript',
  'HTML', 'CSS', 'Tailwind', 'SQL', 'Python', 'Git', 'REST API', 'GraphQL',
  'Docker', 'AWS', 'Redux', 'Next.js', 'Jest', 'CI/CD'
];

export const parseAndAnalyzeResume = (resumeText = '', jobDescription = '') => {
  const normalizedResume = resumeText.toLowerCase();
  
  // Identify present skills from benchmark dictionary
  const detectedSkills = CORE_KEYWORDS.filter((skill) =>
    normalizedResume.includes(skill.toLowerCase())
  );

  // Determine target keywords from Job Description or fallback list
  let targetKeywords = CORE_KEYWORDS.slice(0, 8);
  if (jobDescription.trim().length > 0) {
    const normalizedJD = jobDescription.toLowerCase();
    const jdExtracted = CORE_KEYWORDS.filter((skill) =>
      normalizedJD.includes(skill.toLowerCase())
    );
    if (jdExtracted.length > 0) {
      targetKeywords = jdExtracted;
    }
  }

  // Calculate missing keywords
  const missingKeywords = targetKeywords.filter(
    (skill) => !detectedSkills.map((s) => s.toLowerCase()).includes(skill.toLowerCase())
  );

  const matchScore = Math.round(
    ((targetKeywords.length - missingKeywords.length) / targetKeywords.length) * 100
  ) || 0;

  // Generate tailored bullet-point recommendations
  const bulletSuggestions = missingKeywords.slice(0, 3).map((skill) => 
    `Highlight experience with ${skill} in your project bullet points to align with job description ATS filters.`
  );

  return {
    matchScore,
    detectedSkills,
    missingKeywords,
    bulletSuggestions: bulletSuggestions.length > 0 
      ? bulletSuggestions 
      : ['Resume is strongly aligned with targeted job description keywords!'],
  };
};