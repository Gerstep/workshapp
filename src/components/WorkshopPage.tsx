import React, { useState, useEffect } from 'react';
import { StepPage } from '@/lib/sessionStructure';
import CreateSticker from '@/components/CreateSticker';
import Sticker, { StickerType } from '@/components/Sticker';

interface WorkshopPageProps {
  page: StepPage;
  sessionId: string;
  stickers: StickerType[];
  onStickerCreated: () => void;
  onVote: (stickerId: string) => void;
  onUnvote: (stickerId: string) => void;
  onDelete: (stickerId: string) => void;
}

const MAX_VOTES = 3;

const WorkshopPage: React.FC<WorkshopPageProps> = ({
  page,
  sessionId,
  stickers,
  onStickerCreated,
  onVote,
  onUnvote,
  onDelete,
}) => {
  const [remainingVotes, setRemainingVotes] = useState(MAX_VOTES);
  const [userVotes, setUserVotes] = useState<{ [key: string]: number }>({});
  const [localStickers, setLocalStickers] = useState(stickers);

  useEffect(() => {
    const storedVotes = localStorage.getItem(`workshop_votes_${sessionId}_${page.title}`);
    if (storedVotes) {
      const parsedVotes = JSON.parse(storedVotes)as { [key: string]: number };
      setUserVotes(parsedVotes);
      setRemainingVotes(MAX_VOTES - Object.values(parsedVotes).reduce((a, b) => a + b, 0));
    }
  }, [sessionId, page.title]);

  useEffect(() => {
    setLocalStickers(stickers);
  }, [stickers]);

  const handleVote = (stickerId: string) => {
    if (remainingVotes > 0) {
      const newUserVotes = { ...userVotes, [stickerId]: (userVotes[stickerId] || 0) + 1 };
      setUserVotes(newUserVotes);
      setRemainingVotes(remainingVotes - 1);
      localStorage.setItem(`workshop_votes_${sessionId}_${page.title}`, JSON.stringify(newUserVotes));
      
      setLocalStickers(prevStickers =>
        prevStickers.map(sticker =>
          sticker.id === stickerId ? { ...sticker, votes: (sticker.votes || 0) + 1 } : sticker
        )
      );
      
      onVote(stickerId);
    }
  };

  const handleUnvote = (stickerId: string) => {
    if (userVotes[stickerId] && userVotes[stickerId] > 0) {
      const newUserVotes = { ...userVotes, [stickerId]: userVotes[stickerId] - 1 };
      if (newUserVotes[stickerId] === 0) {
        delete newUserVotes[stickerId];
      }
      setUserVotes(newUserVotes);
      setRemainingVotes(remainingVotes + 1);
      localStorage.setItem(`workshop_votes_${sessionId}_${page.title}`, JSON.stringify(newUserVotes));
      
      setLocalStickers(prevStickers =>
        prevStickers.map(sticker =>
          sticker.id === stickerId ? { ...sticker, votes: Math.max(0, (sticker.votes || 0) - 1) } : sticker
        )
      );
      
      onUnvote(stickerId);
    }
  };

  const handleDelete = (stickerId: string) => {
    if (userVotes[stickerId]) {
      setRemainingVotes(remainingVotes + userVotes[stickerId]);
      const newUserVotes = { ...userVotes };
      delete newUserVotes[stickerId];
      setUserVotes(newUserVotes);
      localStorage.setItem(`workshop_votes_${sessionId}_${page.title}`, JSON.stringify(newUserVotes));
    }
    setLocalStickers(prevStickers => prevStickers.filter(sticker => sticker.id !== stickerId));
    onDelete(stickerId);
  };

  return (
    <div>
      <p className="mb-4">{page.content}</p>
      <p className="mb-4">Remaining votes: {remainingVotes}</p>
      <CreateSticker sessionId={sessionId} onStickerCreated={onStickerCreated} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {localStickers.map((sticker) => (
          <Sticker
            key={sticker.id}
            id={sticker.id}
            text={sticker.text}
            author={sticker.author}
            votes={sticker.votes}
            session_id={sessionId}
            onVote={handleVote}
            onUnvote={handleUnvote}
            onDelete={handleDelete}
            canVote={remainingVotes > 0}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkshopPage;