"use client";
import React, { useEffect, useState } from 'react';

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

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties');
        const data = await response.json();
        setProperties(data.properties);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Property Listings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <div
              key={property.id}
              className="border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{property.title}</h2>
                <p className="text-gray-600 mb-4">{property.description}</p>
                <p className="text-green-600 font-bold mb-4">₹{property.price}</p>
                <p className="text-sm text-gray-500 mb-2">
                  Host: <span className="font-medium text-gray-700">{property.host.username}</span>
                </p>
                <p className="text-sm text-gray-500">Email: {property.host.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}