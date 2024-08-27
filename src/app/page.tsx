'use client';

/*
  This application is an AI-powered design thinking facilitation tool. It helps teams to generate ideas, discuss them, and select the best ones. AI is used to help in deliberation and generation of ideas, as well as synthesis of the the insights.

  To do:
  - Explain workshop task to the user
  - Generate links for multiple users to join the workshop
  - Collect ideas from users
  - Generate insights from the ideas

*/

const questions = [
  "What is the problem we are trying to solve?",
  "What are the possible solutions?",
  "What are the pros and cons of each solution?",
  "What is the best solution?",
]

export default function Workshop() {
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <ul>
        {questions.map((question, index) => (
          <li key={index}>{question}</li>
        ))}
      </ul>
    </div>
  );
}