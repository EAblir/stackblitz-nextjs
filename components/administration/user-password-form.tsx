'use client';

import { useState } from 'react';

export default function ChangePasswordForm() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (password !== confirm) {
      setMessage('Passwords do not match');
      return;
    }
    const res = await fetch('/api/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setMessage('Password updated!');
      setPassword('');
      setConfirm('');
    } else {
      setMessage('Error updating password');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Change Password</h3>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
        required
      />
      <button type="submit">Set Password</button>
      {message && <div>{message}</div>}
    </form>
  );
}