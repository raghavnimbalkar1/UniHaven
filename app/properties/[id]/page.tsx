"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type Property = {
  id: number;
  title: string;
  description: string;
  price: number;
  host: {
    id: number;
    username: string;
    email: string;
  };
};

export default function PropertyDetailsPage() {
  const [property, setProperty] = useState<Property | null>(null);
  const [date, setDate] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const router = useRouter();
  const params = useParams();  // Use useParams to get URL parameters

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        if (!params.id) return;  // Check if params.id is available
        const response = await fetch(`/api/properties/${params.id}`);
        const data = await response.json();
        setProperty(data.property);
      } catch (error) {
        console.error('Error fetching property:', error);
      }
    };

    fetchProperty();
  }, [params.id]);

  const handleBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please login to book.');
        return;
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: property?.id,
          date,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setMessage(data.error);
      } else {
        setMessage('Booking successful!');
      }
    } catch (error) {
      console.error('Booking Error:', error);
      setMessage('Failed to book. Try again.');
    }
  };

  if (!property) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">{property.title}</h1>
        <p className="text-gray-600 mb-4">{property.description}</p>
        <p className="text-green-600 text-2xl font-bold mb-4">₹{property.price}</p>
        <p className="text-sm text-gray-500 mb-4">
          Host: <span className="font-medium text-gray-700">{property.host.username}</span> ({property.host.email})
        </p>
        <input
          type="date"
          className="border p-2 rounded mb-4"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition mb-4"
          onClick={handleBooking}
        >
          Book Now
        </button>
        {message && <p className="text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
}