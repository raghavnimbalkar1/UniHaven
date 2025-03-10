"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (minPrice) queryParams.append('minPrice', minPrice);
        if (maxPrice) queryParams.append('maxPrice', maxPrice);
        const response = await fetch(`/api/properties?${queryParams.toString()}`);
        const data = await response.json();
        setProperties(data.properties.slice(0, 6));
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, [minPrice, maxPrice]);

  const handleSearch = () => {
    if (search.trim()) {
      router.push(`/search?query=${search.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-20 text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to UniHaven</h1>
        <p className="text-xl mb-6">Find the best accommodations for students!</p>
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 rounded-l-md text-gray-800"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-white text-blue-600 rounded-r-md"
          >
            Search
          </button>
        </div>
        <button
          className="px-6 py-2 bg-white text-blue-600 rounded-md shadow-md hover:bg-gray-100 transition mb-6"
          onClick={() => router.push('/login')}
        >
          Login / Sign Up
        </button>
      </div>

      <div className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Featured Properties</h2>
        <div className="mb-8 flex gap-4">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <div
              key={property.id}
              className="border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-lg transition-shadow duration-300"
              onClick={() => router.push(`/properties/${property.id}`)}
            >
              <div className="p-6 cursor-pointer">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{property.title}</h3>
                <p className="text-gray-600 mb-4">{property.description}</p>
                <p className="text-green-600 font-bold mb-4">₹{property.price}</p>
                <p className="text-sm text-gray-500 mb-2">
                  Host: <span className="font-medium text-gray-700">{property.host.username}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}