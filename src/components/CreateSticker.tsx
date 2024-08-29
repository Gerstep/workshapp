import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CreateStickerProps {
  sessionId: string;
  onStickerCreated: () => void;
}

const CreateSticker: React.FC<CreateStickerProps> = ({ sessionId, onStickerCreated }) => {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() === '' || author.trim() === '') return;

    try {
      const { error } = await supabase
        .from('stickers')
        .insert({ text, author, session_id: sessionId, votes: 0 });

      if (error) throw error;

      setText('');
      setAuthor('');
      onStickerCreated();
    } catch (error) {
      console.error('Error creating sticker:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Sticker text"
        className="border p-2 mr-2"
      />
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Your name"
        className="border p-2 mr-2"
      />
      <button type="submit" className="bg-green-500 text-white p-2 rounded">
        Add Sticker
      </button>
    </form>
  );
};

export default CreateSticker;