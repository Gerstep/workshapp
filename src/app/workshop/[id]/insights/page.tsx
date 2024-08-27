'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { generate } from '@/app/actions';
import { readStreamableValue } from 'ai/rsc';

interface Question {
  id: number;
  content: string;
  answers: Answer[];
}

interface Answer {
  id: number;
  content: string;
}

export const maxDuration = 30;

export default function InsightsPage() {
  const { id } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [generation, setGeneration] = useState<string>('');

  useEffect(() => {
    fetchInsights();
  }, [id]);

  const fetchInsights = async () => {
    try {
      const response = await fetch(`/api/insights?workshopId=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch insights');
      }
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateInsights = async () => {
    const context = questions.map(q => ({
      question: q.content,
      answers: q.answers.map(a => a.content)
    }));

    const { output } = await generate(JSON.stringify(context));

    for await (const delta of readStreamableValue(output)) {
      setGeneration(currentGeneration => `${currentGeneration}${delta}`);
    }
  };

  if (isLoading) {
    return <div>Loading insights...</div>;
  }

  return (
    <div className="flex flex-col w-full max-w-4xl py-24 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Workshop Insights</h1>
      <div className="mb-8">
        {questions.map((question) => (
          <div key={question.id} className="mb-4">
            <h2 className="text-xl font-semibold">{question.content}</h2>
            <ul className="list-disc pl-6">
              {question.answers.map((answer) => (
                <li key={answer.id}>{answer.content}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex justify-center mb-8">
        <button
          className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-300 ease-in-out"
          onClick={generateInsights}
        >
          Generate Insights
        </button>
      </div>
      {generation && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">AI-Generated Insights:</h2>
          <p>{generation}</p>
        </div>
      )}
    </div>
  );
}