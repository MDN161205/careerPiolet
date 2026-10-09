import { useEffect, useState } from 'react';

export default function Dashboard({ onLogout }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Form State
  const [targetRole, setTargetRole] = useState('');
  const [skills, setSkills] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Student/Fresher');
  const [bio, setBio] = useState('');

  // Sprint 5 AI Skill Gap State
  const [analysis, setAnalysis] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  // Sprint 6 Placement Interview Prep State
  const [interviewPrep, setInterviewPrep] = useState(null);
  const [activeHintId, setActiveHintId] = useState(null);

  // Sprint 7 Resume Optimizer State
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeAnalysis, setResumeAnalysis] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);

  const fetchCareerAnalysis = async (token) => {
    setAnalysisLoading(true);
    try {
      const res = await fetch('/api/career/analyze', {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok) setAnalysis(data);
    } catch (err) {
      console.error('Error fetching career analysis:', err);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const fetchInterviewPrep = async (token) => {
    try {
      const res = await fetch('/api/career/interview-prep', {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok) setInterviewPrep(data);
    } catch (err) {
      console.error('Error fetching interview prep:', err);
    }
  };

  const handleAnalyzeResume = async (e) => {
    e.preventDefault();
    if (!resumeText.trim()) return;

    setResumeLoading(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('/api/career/analyze-resume', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      const data = await res.json();
      if (res.ok) {
        setResumeAnalysis(data);
      } else {
        console.error('Resume analysis failed:', data.message);
      }
    } catch (err) {
      console.error('Error analyzing resume:', err);
    } finally {
      setResumeLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data);
          setTargetRole(data.targetRole || 'Full Stack Developer');
          setSkills(Array.isArray(data.skills) ? data.skills.join(', ') : '');
          setExperienceLevel(data.experienceLevel || 'Student/Fresher');
          setBio(data.bio || '');

          fetchCareerAnalysis(token);
          fetchInterviewPrep(token);
        } else {
          setError(data.message || 'Failed to fetch user profile');
        }
      } catch {
        setError('Error connecting to backend server');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaveStatus('Saving...');
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetRole, skills, experienceLevel, bio }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data);
        setIsEditing(false);
        setSaveStatus('Profile updated successfully!');

        fetchCareerAnalysis(token);
        fetchInterviewPrep(token);
      } else {
        setSaveStatus(data.message || 'Failed to update profile');
      }
    } catch {
      setSaveStatus('Error updating profile');
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading profile...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={onLogout} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1.5rem', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'left' }}>
      <h2>Career Dashboard</h2>
      <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Welcome back, {user.name}!</p>

      {saveStatus && <p style={{ padding: '8px', background: '#2e7d32', color: '#fff', borderRadius: '4px' }}>{saveStatus}</p>}

      {!isEditing ? (
        <div style={{ margin: '1.5rem 0', background: '#222', color: '#fff', padding: '1.2rem', borderRadius: '6px' }}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Target Role:</strong> {user.targetRole || 'Not specified'}</p>
          <p><strong>Experience Level:</strong> {user.experienceLevel}</p>
          <p><strong>Skills:</strong> {user.skills && user.skills.length > 0 ? user.skills.join(', ') : 'No skills added yet'}</p>
          <p><strong>Bio:</strong> {user.bio || 'No bio added'}</p>

          <button
            onClick={() => setIsEditing(true)}
            style={{ marginTop: '1rem', padding: '8px 16px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Edit Profile & Target Skills
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpdateProfile} style={{ margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>Target Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Full Stack Developer, Frontend Developer, AI Engineer"
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>Skills (comma-separated)</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React, Node.js, Python, SQL, Tailwind"
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            >
              <option value="Student/Fresher">Student / Fresher</option>
              <option value="Junior">Junior (0-2 years)</option>
              <option value="Mid-Level">Mid-Level (2-5 years)</option>
              <option value="Senior">Senior (5+ years)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>Short Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="3"
              placeholder="Tell us about your career focus..."
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" style={{ flex: 1, padding: '10px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              style={{ flex: 1, padding: '10px', background: '#666', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Sprint 5 AI Skill Gap Analysis Section */}
      <div style={{ margin: '1.5rem 0', background: '#1e1e1e', color: '#fff', padding: '1.2rem', borderRadius: '6px' }}>
        <h3 style={{ marginTop: 0 }}>AI Skill Gap Analysis</h3>
        {analysisLoading ? (
          <p style={{ color: '#aaa' }}>Analyzing skills against role benchmark...</p>
        ) : analysis ? (
          <div>
            <p><strong>Target Role Evaluated:</strong> {analysis.targetRole}</p>
            <p>
              <strong>Match Readiness:</strong>{' '}
              <span style={{ color: analysis.matchPercentage >= 70 ? '#4caf50' : '#ff9800', fontWeight: 'bold' }}>
                {analysis.matchPercentage}%
              </span>
            </p>

            <div style={{ marginTop: '1rem' }}>
              <p style={{ color: '#81c784', marginBottom: '0.25rem' }}>
                <strong>Matching Benchmark Skills:</strong>
              </p>
              <p style={{ fontSize: '0.95rem' }}>
                {analysis.matchedSkills && analysis.matchedSkills.length > 0
                  ? analysis.matchedSkills.join(', ')
                  : 'None matched yet.'}
              </p>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <p style={{ color: '#ffb74d', marginBottom: '0.25rem' }}>
                <strong>Recommended Skills to Learn:</strong>
              </p>
              <p style={{ fontSize: '0.95rem' }}>
                {analysis.missingSkills && analysis.missingSkills.length > 0
                  ? analysis.missingSkills.join(', ')
                  : 'All core role benchmarks met! 🎉'}
              </p>
            </div>

            {/* Action Plan Roadmap */}
            {analysis.roadmap && (
              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #333' }}>
                <h4 style={{ color: '#64b5f6', marginBottom: '0.75rem', marginTop: 0 }}>🎯 Recommended Action Plan</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {analysis.roadmap.map((item, idx) => (
                    <div key={idx} style={{ background: '#2a2a2a', padding: '0.8rem', borderRadius: '4px', borderLeft: '3px solid #64b5f6' }}>
                      <p style={{ margin: 0, fontWeight: 'bold', fontSize: '0.9rem', color: '#e0e0e0' }}>
                        {item.phase}: {item.topic}
                      </p>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#aaa' }}>
                        {item.action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p style={{ color: '#aaa' }}>No analysis available. Please save your skills to run analysis.</p>
        )}
      </div>

      {/* Sprint 6 AI Placement Interview Prep Section */}
      <div style={{ margin: '1.5rem 0', background: '#18181b', color: '#fff', padding: '1.2rem', borderRadius: '6px', border: '1px solid #27272a' }}>
        <h3 style={{ marginTop: 0, color: '#f4f4f5' }}>💼 Placement Interview Preparation</h3>
        {interviewPrep && interviewPrep.questions ? (
          <div>
            <p style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
              Tailored questions for <strong>{interviewPrep.targetRole}</strong> ({interviewPrep.experienceLevel})
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {interviewPrep.questions.map((q) => (
                <div key={q.id} style={{ background: '#27272a', padding: '0.9rem', borderRadius: '5px' }}>
                  <span style={{ fontSize: '0.75rem', background: '#3f3f46', padding: '2px 8px', borderRadius: '4px', color: '#38bdf8' }}>
                    {q.category}
                  </span>
                  <p style={{ margin: '0.5rem 0 0.25rem 0', fontWeight: 'bold', fontSize: '0.95rem' }}>
                    {q.id}. {q.question}
                  </p>
                  <button
                    onClick={() => setActiveHintId(activeHintId === q.id ? null : q.id)}
                    style={{ background: 'transparent', border: 'none', color: '#a855f7', cursor: 'pointer', padding: 0, fontSize: '0.85rem', marginTop: '0.25rem' }}
                  >
                    {activeHintId === q.id ? 'Hide Key Concepts' : '💡 Show Answer Framework'}
                  </button>
                  {activeHintId === q.id && (
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#d4d4d8', background: '#18181b', padding: '0.6rem', borderRadius: '4px' }}>
                      {q.hint}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p style={{ color: '#71717a' }}>Loading practice questions...</p>
        )}
      </div>

      {/* Sprint 7 AI Resume Optimizer Section */}
      <div style={{ margin: '1.5rem 0', background: '#0f172a', color: '#fff', padding: '1.2rem', borderRadius: '6px', border: '1px solid #1e293b' }}>
        <h3 style={{ marginTop: 0, color: '#38bdf8' }}>📄 AI Resume & ATS Optimizer</h3>
        <form onSubmit={handleAnalyzeResume} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
              Paste Your Resume Text:
            </label>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows="4"
              placeholder="e.g. Developed full-stack web applications using React, Node.js, and Express..."
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '4px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
              Target Job Description (Optional):
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows="3"
              placeholder="e.g. Looking for a Full Stack Developer with experience in React, MongoDB, SQL, and Docker..."
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '4px' }}
            />
          </div>

          <button
            type="submit"
            disabled={resumeLoading || !resumeText.trim()}
            style={{ padding: '8px 16px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {resumeLoading ? 'Analyzing ATS Alignment...' : '🔍 Analyze Resume ATS Match'}
          </button>
        </form>

        {resumeAnalysis && (
          <div style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid #334155' }}>
            <p>
              <strong>ATS Compatibility Match:</strong>{' '}
              <span style={{ color: resumeAnalysis.matchScore >= 70 ? '#4caf50' : '#f59e0b', fontWeight: 'bold' }}>
                {resumeAnalysis.matchScore}%
              </span>
            </p>

            <div style={{ margin: '0.75rem 0' }}>
              <p style={{ color: '#4ade80', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <strong>Detected Keywords:</strong>
              </p>
              <p style={{ fontSize: '0.85rem' }}>
                {resumeAnalysis.detectedSkills.length > 0 ? resumeAnalysis.detectedSkills.join(', ') : 'None detected.'}
              </p>
            </div>

            <div style={{ margin: '0.75rem 0' }}>
              <p style={{ color: '#fbbf24', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <strong>Missing Job Description Keywords:</strong>
              </p>
              <p style={{ fontSize: '0.85rem' }}>
                {resumeAnalysis.missingKeywords.length > 0 ? resumeAnalysis.missingKeywords.join(', ') : 'No missing core keywords!'}
              </p>
            </div>

            <div style={{ marginTop: '0.75rem' }}>
              <p style={{ color: '#38bdf8', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <strong>Bullet Point Enhancement Suggestions:</strong>
              </p>
              <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: '#cbd5e1' }}>
                {resumeAnalysis.bulletSuggestions.map((tip, idx) => (
                  <li key={idx} style={{ marginBottom: '0.25rem' }}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onLogout}
        style={{ width: '100%', padding: '10px', background: '#d9534f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Logout
      </button>
    </div>
  );
}