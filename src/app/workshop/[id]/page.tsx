'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';


interface Question {
  id: number;
  content: string;
}

interface Answer {
  id: number;
  content: string;
}

export default function QuestionsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQuestions().finally(() => setIsLoading(false));
  }, [id]);

  const handleFinishWorkshop = () => {
    router.push(`/workshop/${id}/insights`);
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/questions?workshopId=${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setQuestions(data);
      } else {
        console.error('Received non-array data:', data);
        setQuestions([]);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
    }
  };

  const fetchAnswers = async (questionId: number) => {
    const response = await fetch(`/api/answers?questionId=${questionId}`);
    const data = await response.json();
    setAnswers(data);
  };

  const handleQuestionSelect = (question: Question) => {
    setSelectedQuestion(question);
    fetchAnswers(question.id);
  };

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion) return;

    const response = await fetch('/api/answers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newAnswer, questionId: selectedQuestion.id }),
    });

    if (response.ok) {
      setNewAnswer('');
      fetchAnswers(selectedQuestion.id);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl py-24 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Workshop Questions</h1>
      {isLoading ? (
        <p>Loading questions...</p>
      ) : questions.length > 0 ? (
        <div className="flex">
          <div className="w-1/3 pr-4">
            <h2 className="text-xl font-semibold mb-2">Questions</h2>
            <ul>
              {questions.map((question) => (
                <li
                  key={question.id}
                  className="cursor-pointer hover:bg-gray-100 p-2"
                  onClick={() => handleQuestionSelect(question)}
                >
                  {question.content}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-2/3 pl-4">
            {selectedQuestion && (
              <>
                <h2 className="text-xl font-semibold mb-2">Selected Question</h2>
                <p className="mb-4">{selectedQuestion.content}</p>
                <h3 className="text-lg font-semibold mb-2">Answers</h3>
                <ul className="mb-4">
                  {answers.map((answer) => (
                    <li key={answer.id} className="mb-2">
                      {answer.content}
                    </li>
                  ))}
                </ul>
                <form onSubmit={handleAnswerSubmit}>
                  <textarea
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                    placeholder="Your answer"
                    rows={3}
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded"
                  >
                    Submit Answer
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      ) : (
        <p>No questions found.</p>
      )}
      <button
        type="button"
        className="bg-green-700 text-white p-2 rounded mt-20"
        onClick={handleFinishWorkshop}
      >
        Finish Workshop
      </button>
    </div>
  );
}