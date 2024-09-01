'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { StickerType } from '@/components/Sticker';
import { fetchSessionName, fetchStickers, setupRealtimeSubscription, voteSticker, unvoteSticker, deleteSticker } from '@/lib/database';
import { sessionSteps, Step, StepPage } from '@/lib/sessionStructure';
import InstructionsPage from '@/components/InstructionsPage';
import WorkshopPage from '@/components/WorkshopPage';
import AnalysisPage from '@/components/AnalysisPage';
import ShareLink from '@/components/ShareLink';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

export default function SessionPage() {
  const { id } = useParams<{ id: string }>();
  const [sessionName, setSessionName] = useState('');
  const [stickers, setStickers] = useState<StickerType[]>([]);
  const [shareLink, setShareLink] = useState('');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  useEffect(() => {
    const loadSessionData = async () => {
      const name = await fetchSessionName(id);
      setSessionName(name);
    };

    const loadStickers = async () => {
      const fetchedStickers = await fetchStickers(id);
      setStickers(fetchedStickers);
    };

    loadSessionData();
    loadStickers();
    const unsubscribe = setupRealtimeSubscription(id, loadStickers);
    setShareLink(`${window.location.origin}/session/${id}`);

    return unsubscribe;
  }, [id]);

  const handleVote = async (stickerId: string) => {
    await voteSticker(stickerId);
    const updatedStickers = await fetchStickers(id);
    setStickers(updatedStickers);
  };

  const handleUnvote = async (stickerId: string) => {
    await unvoteSticker(stickerId);
    const updatedStickers = await fetchStickers(id);
    setStickers(updatedStickers);
  };

  const handleDelete = async (stickerId: string) => {
    await deleteSticker(stickerId);
    const updatedStickers = await fetchStickers(id);
    setStickers(updatedStickers);
  };

  const handleStickerCreated = async () => {
    const updatedStickers = await fetchStickers(id);
    setStickers(updatedStickers);
  };

  const currentStep: Step = sessionSteps[currentStepIndex];
  const currentPage: StepPage = currentStep.pages[currentPageIndex];

  const handleNext = () => {
    if (currentPageIndex < currentStep.pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else if (currentStepIndex < sessionSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setCurrentPageIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    } else if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setCurrentPageIndex(sessionSteps[currentStepIndex - 1].pages.length - 1);
    }
  };

  const renderPage = () => {
    switch (currentPage.type) {
      case 'instructions':
        return <InstructionsPage page={currentPage} />;
      case 'workshop':
        return (
          <WorkshopPage
            page={currentPage}
            sessionId={id}
            stickers={stickers}
            onStickerCreated={handleStickerCreated}
            onVote={handleVote}
            onUnvote={handleUnvote}
            onDelete={handleDelete}
          />
        );
      case 'analysis':
        return <AnalysisPage page={currentPage} sessionId={id} stepTitle={currentStep.title} />;
      case 'custom':
        if (currentPage.component) {
          const CustomComponent = currentPage.component;
          return <CustomComponent sessionId={id} />;
        }
        return <p>Custom component not found</p>;
      default:
        return <p>Unknown page type</p>;
    }
  };

  return (
    <div className="p-4">
      Session: {sessionName}
      <ShareLink link={shareLink} />
      <div className="mb-4">
        <h2 className="text-4xl font-semibold">{currentStep.title}</h2>
        <h2 className="text-3xl mt-6 font-semibold">{currentPage.title}</h2>
      </div>
      {renderPage()}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevious}
          disabled={currentStepIndex === 0 && currentPageIndex === 0}
          className="bg-gray-500 text-white p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          title="Previous"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <button
          onClick={handleNext}
          disabled={currentStepIndex === sessionSteps.length - 1 && currentPageIndex === currentStep.pages.length - 1}
          className="bg-blue-500 text-white p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          title="Next"
        >
          <ArrowRightIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}