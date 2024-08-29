'use client';

import Link from 'next/link';

import { useState, useEffect } from 'react';

interface Workshop {
  id: number;
  title: string;
}

export default function WorkshopPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [newWorkshopTitle, setNewWorkshopTitle] = useState('');

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    const response = await fetch('/api/workshops');
    const data = await response.json();
    setWorkshops(data);
  };

  const createWorkshop = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/workshops', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newWorkshopTitle }),
    });
    if (response.ok) {
      setNewWorkshopTitle('');
      fetchWorkshops();
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <h1 className="text-2xl font-bold mb-4">Create workshop</h1>
      <form onSubmit={createWorkshop} className="mb-4">
        <input
          type="text"
          value={newWorkshopTitle}
          onChange={(e) => setNewWorkshopTitle(e.target.value)}
          placeholder="New workshop title"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Create New Workshop
        </button>
      </form>
      <h1 className="text-2xl font-bold mb-4 mt-8">Live workshops</h1>
      <ul>
        {workshops.map((workshop) => (
          <li key={workshop.id} className="mb-2">
            <Link href={`/workshop/${workshop.id}`}>
              {workshop.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}