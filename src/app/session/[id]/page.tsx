'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Sticker, { StickerType } from '@/components/Sticker';
import CreateSticker from '@/components/CreateSticker';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SessionPage() {
  const { id } = useParams<{ id: string }>();
  const [sessionName, setSessionName] = useState('');
  const [stickers, setStickers] = useState<StickerType[]>([]);
  const [shareLink, setShareLink] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

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
    const { error } = await supabase.rpc('increment_vote', { sticker_id: stickerId });
    if (error) {
      console.error('Error voting:', error);
    } else {
      fetchStickers();
    }
  };

  const handleDelete = async (stickerId: string) => {
    const { error } = await supabase
      .from('stickers')
      .delete()
      .eq('id', stickerId);
    if (error) {
      console.error('Error deleting sticker:', error);
    } else {
      fetchStickers();
    }
  };

  const handleStickerCreated = () => {
    fetchStickers();
  };

  const steps = [
    {
      type: 'text',
      content: 'Welcome to the session. This is the first step. Click next to proceed.',
    },
    {
      type: 'text',
      content: 'This is the second step. Follow the instructions and click next to proceed.',
    },
    {
      type: 'interactive',
      content: 'This is the interactive step. Add your stickers below.',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Session: {sessionName}</h1>
      <p className="mb-4">Share this link to join the session: {shareLink}</p>
      {steps[currentStep].type === 'text' && (
        <div>
          <p>{steps[currentStep].content}</p>
        </div>
      )}
      {steps[currentStep].type === 'interactive' && (
        <div>
          <CreateSticker sessionId={id} onStickerCreated={handleStickerCreated} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
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
        </div>
      )}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="bg-gray-500 text-white p-2 rounded"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}