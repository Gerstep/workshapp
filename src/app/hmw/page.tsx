'use client';

import React, { useState } from 'react';
import { generateHMW } from '@/app/actions';
import { readStreamableValue } from 'ai/rsc';
export const maxDuration = 30;

interface HMW {
  hmw: string;
  confidence: string;
}

interface GeneratedHMWs {
  hmws: HMW[];
}

export default function HMWPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [hmws, setHMWs] = useState<HMW[]>([]);
  const [problemStatement, setProblemStatement] = useState('');

  const handleGenerateHMW = async () => {
    setIsLoading(true);
    setHMWs([]);

    try {
      const { output } = await generateHMW(problemStatement);
      let generatedText = '';

      for await (const delta of readStreamableValue(output)) {
        generatedText += delta;
      }

      const parsedHMWs: GeneratedHMWs = JSON.parse(generatedText);
      setHMWs(parsedHMWs.hmws);
    } catch (error) {
      console.error('Error generating HMW:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl py-24 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Generate How Might We statements</h1>

      <div className="mb-4">
        <label htmlFor="problemStatement" className="block text-sm font-medium text-gray-700 mb-2">
          Enter your problem statement:
        </label>
        <input
          type="text"
          id="problemStatement"
          value={problemStatement}
          onChange={(e) => setProblemStatement(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe your problem here"
        />
      </div>

      <div className="flex justify-center mb-8">
        <button
          className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out"
          onClick={handleGenerateHMW}
          disabled={isLoading || !problemStatement.trim()}
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {isLoading && <div>Generating HMWs...</div>}

      {hmws.length > 0 && (
        <div className="bg-gray-100 p-4 rounded mt-8">
          <h2 className="text-xl font-semibold mb-4">Generated HMWs:</h2>
          <ul className="space-y-4">
            {hmws.map((hmw, index) => (
              <li key={index} className="border-b pb-2">
                <p className="font-medium">{hmw.hmw}</p>
                <p className="text-sm text-gray-600">Confidence: {hmw.confidence}/10</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}