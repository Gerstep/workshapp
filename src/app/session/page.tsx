'use client'

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Sticker from '@/components/Sticker';

interface Sticker {
  id: string;
  text: string;
  author: string;
  votes: number;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SessionPage() {
  const [stickers, setStickers] = useState<Sticker[]>([]);

  useEffect(() => {
    // Initial fetch of stickers
    fetchStickers();

    // Set up real-time listener
    const channel = supabase
      .channel('public:stickers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stickers' }, payload => {
        fetchStickers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStickers = async () => {
    const { data, error } = await supabase
      .from('stickers')
      .select('*')
      .order('votes', { ascending: false });
    if (error) console.error('Error fetching stickers:', error);
    else setStickers(data);
  };

  const addSticker = async (text: string, author: string) => {
    const { error } = await supabase
      .from('stickers')
      .insert({ text, author, votes: 0 });
    if (error) console.error('Error adding sticker:', error);
  };

  const vote = async (stickerId: string) => {
    const { error } = await supabase.rpc('increment_vote', { sticker_id: stickerId });
    if (error) console.error('Error voting:', error);
  };

  const deleteSticker = async (stickerId: string) => {
    const { error } = await supabase
      .from('stickers')
      .delete()
      .eq('id', stickerId);
    if (error) console.error('Error deleting sticker:', error);
    else fetchStickers(); // Refresh the stickers after deletion
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sticker Board</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {stickers.map((sticker) => (
          <Sticker
            key={sticker.id}
            id={sticker.id}
            text={sticker.text}
            author={sticker.author}
            votes={sticker.votes}
            onVote={vote}
            onDelete={deleteSticker}
          />
        ))}
      </div>
      <button
        onClick={() => addSticker('New Sticker', 'User')}
        className="mt-4 bg-blue-500 text-white p-2 rounded"
      >
        Add Sticker
      </button>
    </div>
  );
}