'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchSessions, Session } from '@/lib/database';

export default function SessionListPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const fetchedSessions = await fetchSessions();
      setSessions(fetchedSessions);
      setError(null);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Active Sessions</h1>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      {isLoading ? (
        <p>Loading sessions...</p>
      ) : sessions.length > 0 ? (
        <ul className="space-y-2">
          {sessions.map((session) => (
            <li key={session.id}>
              <Link href={`/session/${session.id}`} className="text-blue-500 hover:underline">
                {session.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No active sessions found.</p>
      )}
      <button 
        onClick={loadSessions} 
        className="mt-4 bg-blue-500 text-white p-2 rounded"
        disabled={isLoading}
      >
        {isLoading ? 'Refreshing...' : 'Refresh Sessions'}
      </button>
    </div>
  );
}