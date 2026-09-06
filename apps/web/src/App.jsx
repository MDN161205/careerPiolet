import { useEffect, useState } from 'react';

function App() {
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setStatus(data.message))
      .catch((err) => {
        console.error('API connection error:', err);
        setStatus('Failed to connect to backend');
      });
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>CareerPilot AI</h1>
      <p>Backend Status: <strong>{status}</strong></p>
    </div>
  );
}

export default App;