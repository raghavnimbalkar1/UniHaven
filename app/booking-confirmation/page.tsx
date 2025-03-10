"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function BookingConfirmationPage() {
  const [booking, setBooking] = useState<any>(null);
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('id');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.error) {
          setMessage(data.error);
        } else {
          setBooking(data.booking);
        }
      } catch (error) {
        console.error('Error fetching booking:', error);
        setMessage('Failed to load booking details.');
      }
    };

    if (bookingId) fetchBooking();
  }, [bookingId, router]);

  if (message) {
    return <div className="text-center py-8 text-red-500">{message}</div>;
  }

  if (!booking) {
    return <div className="text-center py-8">Loading booking details...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Booking Confirmation</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            {booking.property.title}
          </h2>
          <p className="text-gray-600 mb-2">{booking.property.description}</p>
          <p className="text-green-600 font-bold mb-2">
            ₹{booking.property.price}
          </p>
          <p className="text-sm text-gray-500">
            Booking Date: {new Date(booking.date).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500">
            Host: {booking.property.host.username} ({booking.property.host.email})
          </p>
        </div>
      </div>
    </div>
  );
}