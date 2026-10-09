const INTERVIEW_SCENARIOS = {
  'Full Stack Developer': [
    {
      id: 1,
      question: 'How do you handle asynchronous operations in Node.js and prevent unhandled promise rejections?',
      keywords: ['async', 'await', 'try', 'catch', 'promise', 'error handling'],
    },
    {
      id: 2,
      question: 'Explain how state management works in React and when you would use Context API vs Redux.',
      keywords: ['state', 'props', 'context', 'redux', 'global', 're-render'],
    },
    {
      id: 3,
      question: 'How do you structure indexes in MongoDB to optimize slow-running queries?',
      keywords: ['index', 'query', 'execution plan', 'compound', 'performance'],
    },
  ],
  'Frontend Developer': [
    {
      id: 1,
      question: 'Explain the difference between local storage, session storage, and cookies in modern web applications.',
      keywords: ['storage', 'cookie', 'session', 'expiration', 'httpOnly'],
    },
    {
      id: 2,
      question: 'What strategies do you use to ensure responsive design across mobile and desktop devices?',
      keywords: ['media query', 'flexbox', 'grid', 'viewport', 'responsive'],
    },
  ],
  'AI Engineer': [
    {
      id: 1,
      question: 'How do you handle overfitting in machine learning models during training?',
      keywords: ['regularization', 'dropout', 'cross-validation', 'early stopping'],
    },
    {
      id: 2,
      question: 'Explain how vector embeddings are created and stored in vector databases for RAG applications.',
      keywords: ['embedding', 'vector', 'similarity', 'cosine', 'retrieval'],
    },
  ],
};

export const startMockSession = (targetRole = 'Full Stack Developer') => {
  const scenario = INTERVIEW_SCENARIOS[targetRole] || INTERVIEW_SCENARIOS['Full Stack Developer'];
  return {
    sessionId: `mock_${Date.now()}`,
    targetRole,
    totalQuestions: scenario.length,
    currentQuestionIndex: 0,
    currentQuestion: scenario[0],
  };
};

export const evaluateAnswer = (targetRole, questionId, userAnswer = '') => {
  const scenario = INTERVIEW_SCENARIOS[targetRole] || INTERVIEW_SCENARIOS['Full Stack Developer'];
  const questionObj = scenario.find((q) => q.id === Number(questionId)) || scenario[0];

  const normalizedAnswer = userAnswer.toLowerCase();
  const matchedKeywords = questionObj.keywords.filter((kw) =>
    normalizedAnswer.includes(kw)
  );

  const score = Math.min(10, Math.max(3, Math.round((matchedKeywords.length / questionObj.keywords.length) * 10)));

  let feedback = 'Good effort! Try to incorporate more core technical terminology.';
  if (score >= 8) {
    feedback = 'Excellent answer! Clear explanation covering key architectural concepts.';
  } else if (score >= 6) {
    feedback = 'Solid response. Elaborate further on practical code implementation details.';
  }

  return {
    questionId: questionObj.id,
    score,
    feedback,
    matchedKeywords,
    missingKeywords: questionObj.keywords.filter((kw) => !matchedKeywords.includes(kw)),
  };
};