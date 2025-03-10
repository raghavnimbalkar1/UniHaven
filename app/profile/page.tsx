"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: number;
  username: string;
  email: string;
  role: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (data.error) {
          console.log(data.error);
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error('Error fetching user info:', error);
        setMessage('Failed to load profile.');
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (message) {
    return <div className="text-center py-8 text-red-500">{message}</div>;
  }

  if (!user) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Profile</h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">User Information</h2>
          <p className="text-gray-600 mb-2">
            <strong>Name:</strong> {user.username}
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Email:</strong> {user.email}
          </p>
          <p className="text-gray-600 mb-4">
            <strong>Role:</strong> {user.role}
          </p>
          <button
            className="px-6 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}