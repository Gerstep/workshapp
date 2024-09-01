import React from 'react';
import { StepPage } from '@/lib/sessionStructure';

interface InstructionsPageProps {
  page: StepPage;
}

const InstructionsPage: React.FC<InstructionsPageProps> = ({ page }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{page.title}</h2>
      <div className="prose">{page.content}</div>
    </div>
  );
};

export default InstructionsPage;