import React, { useState, useEffect } from 'react';
import { StepPage } from '@/lib/sessionStructure';
import { StickerType } from '@/components/Sticker';
import { extractInsights } from '@/actions/analyze';
import { useStreamableValue, readStreamableValue } from 'ai/rsc';

interface AnalysisPageProps {
  page: StepPage;
  sessionId: string;
  stepTitle: string;
  stickers: StickerType[];
}

const AnalysisPage: React.FC<AnalysisPageProps> = ({ page, sessionId, stepTitle, stickers }) => {
  const [generatedText, setGeneratedText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const performAnalysis = async () => {
      try {
        setIsLoading(true);
        const { output } = await extractInsights(stickers, stepTitle);
        let text = '';
        for await (const delta of readStreamableValue(output)) {
          text += delta;
          setGeneratedText(prevText => prevText + delta);
        }
        setError(null);
      } catch (err) {
        console.error('Error performing analysis:', err);
        setError('An error occurred while analyzing the data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    performAnalysis();
  }, [stickers, stepTitle]);

  return (
    <div className="max-w-2xl mx-auto">
      <p className="mb-4">{page.content}</p>
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      ) : !generatedText ? (
        <p>Performing analysis...</p>
      ) : (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="text-xl font-semibold mb-2">Analysis Results</h3>
          <p>{generatedText}</p>
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;