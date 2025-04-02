import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [formData, setFormData] = useState({
    username: '',
    access_phrase: '',
    newPassword: ''
  });

  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    const { username, access_phrase, newPassword } = formData;

    if (!username || !access_phrase || !newPassword) {
      setMessage('All fields are required.');
      setSuccess(false);
      return;
    }

    const res = await fetch('http://localhost:8080/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage('Password reset successfully. You can now log in.');
      setSuccess(true);
    } else {
      setMessage(data.error || 'Failed to reset password.');
      setSuccess(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '1rem' }}>

      <button onClick={() => navigate("/login")}>Back to Login</button>
      <h2>Reset Password</h2>

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        style={{ display: 'block', width: '100%', marginBottom: '1rem' }}
      />

      <input
        type="text"
        name="access_phrase"
        placeholder="Access Phrase"
        value={formData.accessPhrase}
        onChange={handleChange}
        style={{ display: 'block', width: '100%', marginBottom: '1rem' }}
      />

      <input
        type="password"
        name="newPassword"
        placeholder="New Password"
        value={formData.newPassword}
        onChange={handleChange}
        style={{ display: 'block', width: '100%', marginBottom: '1rem' }}
      />

      <button onClick={handleSubmit} style={{ width: '100%' }}>
        Reset Password
      </button>

      {message && (
        <p style={{ marginTop: '1rem', color: success ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default ResetPassword;