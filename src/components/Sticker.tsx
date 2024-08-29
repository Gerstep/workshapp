import React from 'react';

interface StickerProps {
  id: string;
  text: string;
  author: string;
  votes: number;
  session_id: string; 
  onVote: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface StickerType {
  id: string;
  text: string;
  author: string;
  votes: number;
  session_id: string;
}

const Sticker: React.FC<StickerProps> = ({ id, text, author, votes, onVote, onDelete }) => {
  return (
    <div className="bg-yellow-200 p-4 rounded shadow">
      <p>{text}</p>
      <p className="text-sm text-gray-600">By: {author}</p>
      <div className="flex justify-between items-center mt-2">
        <span>Votes: {votes}</span>
        <div>
          <button
            onClick={() => onVote(id)}
            className="bg-blue-500 text-white px-2 py-1 rounded text-sm mr-2"
          >
            Vote
          </button>
          <button
            onClick={() => onDelete(id)}
            className="bg-red-500 text-white px-2 py-1 rounded text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sticker;