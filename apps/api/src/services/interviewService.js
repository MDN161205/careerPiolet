const QUESTION_BANK = {
  'Full Stack Developer': [
    {
      category: 'Technical',
      question: 'Explain how JWT authentication works in a Node/Express and React application.',
      hint: 'Discuss stateless authentication, sending tokens in HTTP Authorization headers (Bearer token), client-side storage, and verifying payloads with middleware.',
    },
    {
      category: 'Database & Architecture',
      question: 'What is the difference between SQL and NoSQL databases, and when would you choose MongoDB over PostgreSQL?',
      hint: 'Focus on schema flexibility vs ACID compliance, horizontal scaling, and storing unstructured or rapidly changing document schemas.',
    },
    {
      category: 'Behavioral',
      question: 'Describe a situation where you encountered a critical bug during integration and how you resolved it.',
      hint: 'Use the STAR method (Situation, Task, Action, Result). Highlight debugging tools like Chrome DevTools Network tab or server logs.',
    },
  ],
  'Frontend Developer': [
    {
      category: 'Technical',
      question: 'What is the Virtual DOM in React and how does the reconciliation algorithm work?',
      hint: 'Explain diffing algorithms, batching updates, and updating only changed real DOM nodes to minimize expensive browser repaints.',
    },
    {
      category: 'Performance',
      question: 'How do you optimize build sizes and runtime performance in Vite/React?',
      hint: 'Discuss code splitting via React.lazy/Suspense, memoization (useMemo, useCallback), image optimization, and tree-shaking unused packages.',
    },
  ],
  'AI Engineer': [
    {
      category: 'Technical',
      question: 'Explain the core differences between supervised, unsupervised, and reinforcement learning.',
      hint: 'Define labeled training sets vs clustering unlabeled data, and agent-reward feedback loops with real-world examples.',
    },
    {
      category: 'System Design',
      question: 'How would you architect a low-latency API endpoint streaming LLM inference responses to a web client?',
      hint: 'Discuss WebSockets, Server-Sent Events (SSE), asynchronous request queues, and model response caching.',
    },
  ],
};

export const generateInterviewQuestions = (targetRole = 'Full Stack Developer', experienceLevel = 'Student/Fresher') => {
  const selectedBank = QUESTION_BANK[targetRole] || QUESTION_BANK['Full Stack Developer'];

  return {
    targetRole,
    experienceLevel,
    questions: selectedBank.map((q, index) => ({
      id: index + 1,
      category: q.category,
      question: q.question,
      hint: q.hint,
    })),
  };
};