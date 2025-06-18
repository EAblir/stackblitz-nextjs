'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (document.cookie.includes('auth=1')) {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    setIsLoading(false);

    if (res.ok) {
      document.cookie = 'auth=1; path=/';
      router.replace('/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, rgb(195, 207, 226) 0%, rgb(39, 68, 114) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 32px rgba(0,0,0,0.15)',
        padding: 40,
        width: 350,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Image
            alt="Logo"
            src="/images/logo-black.png"
            height={36}
            width={132}
        />
        <h2 style={{ margin: '24px 0 16px', fontWeight: 700, fontSize: 24, color: 'rgb(37, 54, 81)' }} className="text-center">
          Sign in to Bookkeeping Portal
        </h2>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoFocus
            style={{
              width: '100%',
              padding: '12px 16px',
              marginBottom: 16,
              border: '1px solid #ccd6dd',
              borderRadius: 8,
              fontSize: 16,
              outline: 'none'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              marginBottom: 16,
              border: '1px solid #ccd6dd',
              borderRadius: 8,
              fontSize: 16,
              outline: 'none'
            }}
          />
          {error && (
            <div style={{ color: '#e0245e', marginBottom: 12, textAlign: 'center' }}>
              {error}
            </div>
          )}
          <Button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              background: 'rgb(37, 54, 81)',
              padding: '12px 0',
              fontSize: 16,
              cursor: 'pointer',
              marginBottom: 8
            }}
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </Button>
          {isLoading && <div style={{ textAlign: 'center', color: '#657786' }}>Loading...</div>}
        </form>
        {/* <div style={{ color: '#657786', fontSize: 14, marginTop: 8 }}>
          Don’t have an account? <a href="#" style={{ color: 'rgb(37, 54, 81)', textDecoration: 'none' }}>Sign up</a>
        </div> */}
      </div>
    </div>
  );
}