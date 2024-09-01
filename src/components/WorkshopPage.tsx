import React from 'react';
import { StepPage } from '@/lib/sessionStructure';
import CreateSticker from '@/components/CreateSticker';
import Sticker, { StickerType } from '@/components/Sticker';

interface WorkshopPageProps {
  page: StepPage;
  sessionId: string;
  stickers: StickerType[];
  onStickerCreated: () => void;
  onVote: (stickerId: string) => void;
  onDelete: (stickerId: string) => void;
}

const WorkshopPage: React.FC<WorkshopPageProps> = ({
  page,
  sessionId,
  stickers,
  onStickerCreated,
  onVote,
  onDelete,
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{page.title}</h2>
      <p className="mb-4">{page.content}</p>
      <CreateSticker sessionId={sessionId} onStickerCreated={onStickerCreated} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {stickers.map((sticker) => (
          <Sticker
            key={sticker.id}
            id={sticker.id}
            text={sticker.text}
            author={sticker.author}
            votes={sticker.votes}
            session_id={sessionId}
            onVote={onVote}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkshopPage;