import { useEffect, useState } from 'react';
import './App.css';
import Register from './pages/Register';
import Login from './pages/login';

function App() {
  const [status, setStatus] = useState('Loading...');
  const [mode, setMode] = useState('login');

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
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="CareerPilot AI home">
          CareerPilot<span>AI</span>
        </a>
        <p className="header-note">Your next chapter starts here.</p>
      </header>

      <main className="auth-layout">
        <section className="welcome-panel">
          <p className="eyebrow">CAREER DEVELOPMENT, REFOCUSED</p>
          <h1>Make your next move <em>count.</em></h1>
          <p className="welcome-copy">
            Build momentum toward work that fits your ambitions. Sign in to
            continue, or create an account to get started.
          </p>
          <p className="backend-status" role="status">
            <span className="status-dot" /> API: {status}
          </p>
        </section>

        <section className="auth-card" aria-label="Account access">
          <div className="auth-switch" role="tablist" aria-label="Account action">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              className={mode === 'login' ? 'active' : ''}
              onClick={() => setMode('login')}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              className={mode === 'register' ? 'active' : ''}
              onClick={() => setMode('register')}
            >
              Create account
            </button>
          </div>
          <div className="auth-form">
            {mode === 'login' ? <Login /> : <Register />}
          </div>
        </section>
      </main>

      <footer className="site-footer">CareerPilot AI</footer>
    </div>
  );
}

export default App;