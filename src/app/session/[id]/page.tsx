'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Sticker, { StickerType } from '@/components/Sticker';
import CreateSticker from '@/components/Sticker';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SessionPage() {
  const { id } = useParams<{ id: string }>();
  const [sessionName, setSessionName] = useState('');
  const [stickers, setStickers] = useState<StickerType[]>([]);
  const [shareLink, setShareLink] = useState('');

  useEffect(() => {
    fetchSessionData();
    fetchStickers();
    setupRealtimeSubscription();
    setShareLink(`${window.location.origin}/session/${id}`);
  }, [id]);

  const fetchSessionData = async () => {
    const { data, error } = await supabase
      .from('sessions')
      .select('name')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching session:', error);
    } else {
      setSessionName(data.name);
    }
  };

  const fetchStickers = async () => {
    const { data, error } = await supabase
      .from('stickers')
      .select('*')
      .eq('session_id', id)
      .order('votes', { ascending: false });
  
    if (error) {
      console.error('Error fetching stickers:', error);
    } else {
      setStickers(data || []);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('public:stickers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stickers' }, payload => {
        fetchStickers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleVote = async (stickerId: string) => {
    // Implement voting logic
  };

  const handleDelete = async (stickerId: string) => {
    // Implement delete logic
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Session: {sessionName}</h1>
      <p className="mb-4">Share this link to join the session: {shareLink}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stickers.map((sticker) => (
          <Sticker
            key={sticker.id}
            id={sticker.id}
            text={sticker.text}
            author={sticker.author}
            votes={sticker.votes}
            session_id={id}
            onVote={handleVote}
            onDelete={handleDelete}
          />
        ))}
      </div>
      {/* <Sticker onStickerCreated={() => fetchStickers()} /> */}
    </div>
  );
}