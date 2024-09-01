import React, { useState, useEffect } from 'react';
import { StepPage } from '@/lib/sessionStructure';

interface AnalysisPageProps {
  page: StepPage;
  sessionId: string;
  stepTitle: string;
}

const AnalysisPage: React.FC<AnalysisPageProps> = ({ page, sessionId, stepTitle }) => {
  const [analysis, setAnalysis] = useState<string>('');

  useEffect(() => {
    const performAnalysis = async () => {
      // Here you would call your server action to perform the AI analysis
      // For now, we'll just simulate it with a timeout
      setTimeout(() => {
        setAnalysis(`AI analysis for ${stepTitle}: Lorem ipsum dolor sit amet...`);
      }, 2000);
    };

    performAnalysis();
  }, [sessionId, stepTitle]);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{page.title}</h2>
      <p className="mb-4">{page.content}</p>
      {analysis ? (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="text-xl font-semibold mb-2">Analysis Results</h3>
          <p>{analysis}</p>
        </div>
      ) : (
        <p>Performing analysis...</p>
      )}
    </div>
  );
};

export default AnalysisPage;