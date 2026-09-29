import { useState } from 'react';

export default function Login() {
  // 1. STATE DEFINITIONS (Before return)
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. EVENT HANDLERS (Before return)
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
        setMessage(`Welcome back, ${data.name}!`);
      } else {
        setMessage(data.message || 'Login failed');
      }
    } catch {
      setMessage('Error connecting to backend API');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. UI RENDERING (Inside return)
  return (
    <div>
      <h2>Sign in to CareerPilot</h2>
      <p>Sign in to continue</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {message && <p role="alert">{message}</p>}
    </div>
  );
}