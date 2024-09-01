import React from 'react';
import { StepPage } from '@/lib/sessionStructure';

interface InstructionsPageProps {
  page: StepPage;
}

const InstructionsPage: React.FC<InstructionsPageProps> = ({ page }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="prose">{page.content}</div>
    </div>
  );
};

export default InstructionsPage;