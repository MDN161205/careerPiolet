import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function PublicPortfolio() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch(`/api/portfolio/${username}`);
        const data = await res.json();

        if (res.ok) {
          setProfile(data);
        } else {
          setError(data.message || 'Portfolio not found');
        }
      } catch {
        setError('Error connecting to backend server');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [username]);

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#fff' }}>Loading public portfolio...</div>;
  }

  if (error) {
    return (
      <div style={{ maxWidth: '500px', margin: '4rem auto', padding: '2rem', textAlign: 'center', background: '#18181b', color: '#fff', borderRadius: '8px' }}>
        <h2>404 - Portfolio Not Found</h2>
        <p style={{ color: '#a1a1aa' }}>{error}</p>
        <Link to="/" style={{ color: '#38bdf8', textDecoration: 'none' }}>← Return to Home</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '650px', margin: '3rem auto', padding: '2rem', background: '#09090b', color: '#f4f4f5', borderRadius: '12px', border: '1px solid #27272a', textAlign: 'left' }}>
      <div style={{ borderBottom: '1px solid #27272a', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, color: '#f4f4f5' }}>{profile.name}</h1>
        <p style={{ margin: '0.25rem 0 0 0', color: '#38bdf8', fontSize: '1.1rem', fontWeight: 'bold' }}>
          {profile.targetRole}
        </p>
        <p style={{ margin: '0.25rem 0 0 0', color: '#71717a', fontSize: '0.85rem' }}>
          Level: {profile.experienceLevel} | handle: @{profile.username}
        </p>
      </div>

      <div style={{ background: '#18181b', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
        <h3 style={{ marginTop: 0, color: '#e4e4e7', fontSize: '1rem' }}>Candidate Bio</h3>
        <p style={{ margin: 0, color: '#a1a1aa', fontSize: '0.95rem', lineHeight: '1.5' }}>
          {profile.bio || 'No public bio provided.'}
        </p>
      </div>

      <div style={{ background: '#18181b', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
        <h3 style={{ marginTop: 0, color: '#e4e4e7', fontSize: '1rem' }}>Verified Technical Skills</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
          {profile.skills && profile.skills.length > 0 ? (
            profile.skills.map((skill, idx) => (
              <span key={idx} style={{ background: '#27272a', color: '#38bdf8', border: '1px solid #3f3f46', padding: '4px 10px', borderRadius: '16px', fontSize: '0.85rem' }}>
                {skill}
              </span>
            ))
          ) : (
            <p style={{ color: '#71717a', fontSize: '0.85rem' }}>No skills listed.</p>
          )}
        </div>
      </div>

      <div style={{ background: '#022c22', border: '1px solid #065f46', padding: '1rem', borderRadius: '8px' }}>
        <p style={{ margin: 0, color: '#34d399', fontWeight: 'bold' }}>
          🎯 Career Intelligence Benchmark Score: {profile.readinessScore}% Match Readiness
        </p>
      </div>
    </div>
  );
}