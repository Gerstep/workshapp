import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CreateSession({ onSessionCreated }: { onSessionCreated: (shareableLink: string) => void }) {
  const [sessionName, setSessionName] = useState('');
  const router = useRouter();

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionName.trim() === '') return;
  
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: sessionName }),
      });
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem(`session_${data.id}`, data.token);
        router.push(`/session/${data.id}`);
        onSessionCreated(data.shareableLink);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  return (
    <form onSubmit={handleCreateSession} className="flex flex-col gap-2">
      <input
        type="text"
        value={sessionName}
        onChange={(e) => setSessionName(e.target.value)}
        placeholder="Enter session name"
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Create Session
      </button>
    </form>
  );
}