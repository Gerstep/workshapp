'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

interface Session {
  id: string;
  name: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SessionListPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    console.log('Fetching sessions...');
    const { data, error } = await supabase
      .from('sessions')
      .select('id, name')
      .order('created_at', { ascending: false });
  
    console.log('Fetched sessions:', data);
    console.log('Error:', error);
  
    if (error) {
      console.error('Error fetching sessions:', error);
      setError(error.message);
    } else {
      console.log('Number of sessions:', data ? data.length : 0);
      setSessions(data || []);
      setError(null);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Active Sessions</h1>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      {sessions.length > 0 ? (
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
        onClick={fetchSessions} 
        className="mt-4 bg-blue-500 text-white p-2 rounded"
      >
        Refresh Sessions
      </button>
    </div>
  );
}