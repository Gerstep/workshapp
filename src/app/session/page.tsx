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

const MAX_VOTES = 3; 

export default function SessionPage() {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [remainingVotes, setRemainingVotes] = useState(MAX_VOTES);
  const [newStickerText, setNewStickerText] = useState('');

  useEffect(() => {
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

  const initializeVotes = () => {
    const votesUsed = JSON.parse(localStorage.getItem('votesUsed') || '{}');
    const totalVotesUsed = Object.values(votesUsed).reduce((sum: number, count: any) => sum + count, 0);
    setRemainingVotes(MAX_VOTES - totalVotesUsed);
  };

  const fetchStickers = async () => {
    const { data, error } = await supabase
      .from('stickers')
      .select('*')
      .order('votes', { ascending: false });
    if (error) console.error('Error fetching stickers:', error);
    else setStickers(data);
  };

  const addSticker = async () => {
    if (newStickerText.trim() === '') {
      alert('Please enter some text for the sticker.');
      return;
    }

    const { error } = await supabase
      .from('stickers')
      .insert({ text: newStickerText, author: 'User', votes: 0, sticker_text: newStickerText });
    if (error) {
      console.error('Error adding sticker:', error);
    } else {
      setNewStickerText(''); // Clear the input after adding
      fetchStickers(); // Refresh the stickers
    }
  };

  const vote = async (stickerId: string) => {
    if (remainingVotes > 0) {
      const votesUsed = JSON.parse(localStorage.getItem('votesUsed') || '{}');
      if (!votesUsed[stickerId]) {
        votesUsed[stickerId] = 0;
      }
      votesUsed[stickerId]++;
      localStorage.setItem('votesUsed', JSON.stringify(votesUsed));

      const { error } = await supabase.rpc('increment_vote', { sticker_id: stickerId });
      if (error) {
        console.error('Error voting:', error);
      } else {
        setRemainingVotes(remainingVotes - 1);
      }
    } else {
      alert('You have used all your votes!');
    }
  };

  const deleteSticker = async (stickerId: string) => {
    const { error } = await supabase
      .from('stickers')
      .delete()
      .eq('id', stickerId);
    if (error) console.error('Error deleting sticker:', error);
    else {
      // Remove the sticker's votes from localStorage and update remaining votes
      const votesUsed = JSON.parse(localStorage.getItem('votesUsed') || '{}');
      const stickerVotes = votesUsed[stickerId] || 0;
      delete votesUsed[stickerId];
      localStorage.setItem('votesUsed', JSON.stringify(votesUsed));
      setRemainingVotes(remainingVotes + stickerVotes);
      fetchStickers();
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sticker Board</h1>
      <p className="mb-4">Remaining votes: {remainingVotes}</p>
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
      <div className="mt-4 flex">
        <input
          type="text"
          value={newStickerText}
          onChange={(e) => setNewStickerText(e.target.value)}
          placeholder="Enter sticker text"
          className="flex-grow p-2 border rounded-l"
        />
        <button
          onClick={addSticker}
          className="bg-blue-500 text-white p-2 rounded-r"
        >
          Add Sticker
        </button>
      </div>
    </div>
  );
}