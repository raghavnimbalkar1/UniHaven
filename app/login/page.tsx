"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      console.log('Response from API:', data);

      if (data.error) {
        setMessage(data.error);
      } else if (data.token) {  // 🛠️ Check if token exists
        console.log('✅ Token received:', data.token);
        localStorage.setItem('token', data.token);    // 🛠️ Save token to localStorage
        const savedToken = localStorage.getItem('token');
        console.log('✅ Token saved in localStorage:', savedToken);  // 🛠️ Verify token saved
        router.replace('/dashboard');                // 🛠️ Redirect to dashboard
      } else {
        console.log('❌ No token received');
        setMessage('Login failed. No token received.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      setMessage('Failed to log in. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Login</h2>
        {message && <p className="text-red-500 mb-4">{message}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}