'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Question {
  id: number;
  content: string;
  answers: Answer[];
}

interface Answer {
  id: number;
  content: string;
}

export default function InsightsPage() {
  const { id } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="flex flex-col w-full max-w-4xl py-24 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Workshop Insights</h1>
      {isLoading ? (
        <p>Loading insights...</p>
      ) : (
        <div>
          {questions.map((question) => (
            <div key={question.id} className="mb-8">
              <h2 className="text-xl font-semibold mb-2">{question.content}</h2>
              <ul className="list-disc pl-6">
                {question.answers.map((answer) => (
                  <li key={answer.id} className="mb-2">
                    {answer.content}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}