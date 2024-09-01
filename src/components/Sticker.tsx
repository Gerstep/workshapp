import React from 'react';
import { PlusIcon, MinusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface StickerProps {
  id: string;
  text: string;
  author: string;
  votes: number;
  session_id: string;
  onVote: (id: string) => void;
  onUnvote: (id: string) => void;
  onDelete: (id: string) => void;
  canVote: boolean;
}

export interface StickerType {
  id: string;
  text: string;
  author: string;
  votes: number;
  session_id: string;
}

const Sticker: React.FC<StickerProps> = ({
  id,
  text,
  author,
  votes,
  onVote,
  onUnvote,
  onDelete,
  canVote,
}) => {
  return (
    <div className="bg-yellow-200 p-4 rounded shadow">
      <p>{text}</p>
      <p className="text-sm text-gray-600">By: {author}</p>
      <div className="flex justify-between items-center mt-2">
        <span>Votes: {votes || 0}</span>
        <div className="flex space-x-2">
          <button
            onClick={() => onVote(id)}
            disabled={!canVote}
            className={`bg-blue-500 text-white p-1 rounded ${
              !canVote ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
            title="Vote"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onUnvote(id)}
            disabled={!votes}
            className={`bg-red-500 text-white p-1 rounded ${
              !votes ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'
            }`}
            title="Unvote"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="bg-gray-500 text-white p-1 rounded hover:bg-gray-600"
            title="Delete"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sticker;
