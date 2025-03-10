"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Property = {
  id: number;
  title: string;
  description: string;
  price: number;
};

type Booking = {
  id: number;
  date: string;
  property: Property;
};

export default function DashboardPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // 🛠️ Fetch User's Properties
        const propertiesResponse = await fetch('/api/properties', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const propertiesData = await propertiesResponse.json();

        if (propertiesData.error) {
          console.log(propertiesData.error);
          router.push('/login');
          return;
        }

        setProperties(propertiesData.properties || []);

        // 🛠️ Fetch User's Bookings
        const bookingsResponse = await fetch('/api/bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const bookingsData = await bookingsResponse.json();

        if (bookingsData.error) {
          console.log(bookingsData.error);
          router.push('/login');
          return;
        }

        console.log('Bookings Data:', bookingsData);  // 🛠️ Log bookings data

        setBookings(bookingsData.bookings || []);
      } catch (error) {
        console.error('Dashboard Error:', error);
        setMessage('Failed to load dashboard data.');
      }
    };

    fetchDashboardData();
  }, [router]);

  const handleAddProperty = () => {
    router.push('/properties/add');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Dashboard</h1>

        {message && <p className="text-center text-red-500 mb-4">{message}</p>}

        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">Your Properties</h2>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition mb-6"
            onClick={handleAddProperty}
          >
            + Add New Property
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div key={property.id} className="border border-gray-200 rounded-lg shadow-sm bg-white p-4">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{property.title}</h3>
                <p className="text-gray-600 mb-2">{property.description}</p>
                <p className="text-green-600 font-bold mb-2">₹{property.price}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">Your Bookings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookings.map((booking) => (
              <div key={booking.id} className="border border-gray-200 rounded-lg shadow-sm bg-white p-4">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{booking.property.title}</h3>
                <p className="text-gray-600 mb-2">{booking.property.description}</p>
                <p className="text-green-600 font-bold mb-2">₹{booking.property.price}</p>
                <p className="text-sm text-gray-500">Date: {new Date(booking.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}