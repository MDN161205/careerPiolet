import { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        if (onLoginSuccess) {
          onLoginSuccess(data.token);
        } else {
          setMessage(`Welcome back, ${data.name || 'User'}!`);
        }
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Fetch execution error:', err);
      setMessage('Error connecting to backend API');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '1.5rem', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'left' }}>
      <h2>Sign In</h2>
      <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Sign in to continue</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="login-email" style={{ display: 'block', marginBottom: '0.25rem' }}>Email</label>
          <input
            id="login-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="login-password" style={{ display: 'block', marginBottom: '0.25rem' }}>Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {message && <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
}