'use client';

import { useState } from 'react';
import { createSticker } from '@/lib/database';

interface CreateStickerProps {
  sessionId: string;
  onStickerCreated: () => void;
}

export default function CreateSticker({ sessionId, onStickerCreated }: CreateStickerProps) {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text && author) {
      const newSticker = await createSticker(sessionId, text, author);
      if (newSticker) {
        setText('');
        setAuthor('');
        onStickerCreated();
      }
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
        required
      />
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Your name"
        className="border p-2 mr-2"
        required
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Add Sticker
      </button>
    </form>
  );
}