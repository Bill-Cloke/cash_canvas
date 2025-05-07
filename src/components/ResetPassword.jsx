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

      <button onClick={() => navigate("/login")} className='w-full mt-2 styled-button'>Back to Login</button>

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
      />

      <input
        type="text"
        name="access_phrase"
        placeholder="Access Phrase"
        value={formData.accessPhrase}
        onChange={handleChange}
        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
      />

      <input
        type="password"
        name="newPassword"
        placeholder="New Password"
        value={formData.newPassword}
        onChange={handleChange}
        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
      />

      <button onClick={handleSubmit} className='w-full mt-2 styled-button'>
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