import { ReactNode } from 'react';

export interface StepPage {
  type: 'instructions' | 'workshop' | 'analysis' | 'custom';
  title: string;
  content: string | ReactNode;
  component?: React.ComponentType<any>;
}

export interface Step {
  title: string;
  pages: StepPage[];
}

export const sessionSteps: Step[] = [
  {
    title: 'Ideas Brainstorming',
    pages: [
      {
        type: 'instructions',
        title: 'Brainstorming Instructions',
        content: 'In this step, we will brainstorm ideas for our project. Follow these guidelines...',
      },
      {
        type: 'workshop',
        title: 'Idea Generation',
        content: 'Add your ideas as stickers and vote on the best ones.',
      },
      {
        type: 'analysis',
        title: 'AI Analysis of Ideas',
        content: 'Our AI will analyze the generated ideas and provide insights.',
      },
    ],
  },
  {
    title: 'Competitive Analysis',
    pages: [
      {
        type: 'instructions',
        title: 'Competitive Analysis Instructions',
        content: 'In this step, we will analyze our competitors. Here\'s how to proceed...',
      },
      {
        type: 'workshop',
        title: 'Competitor Evaluation',
        content: 'Add stickers for each competitor and their strengths/weaknesses.',
      },
      {
        type: 'analysis',
        title: 'AI Competitive Landscape Analysis',
        content: 'Our AI will analyze the competitive landscape based on your input.',
      },
    ],
  },
  {
    title: 'Brand Values',
    pages: [
      {
        type: 'instructions',
        title: 'Brand Values Instructions',
        content: 'Let\'s define our brand values. Consider the following aspects...',
      },
      {
        type: 'workshop',
        title: 'Value Proposition Canvas',
        content: 'Use the Value Proposition Canvas to define our brand values.',
      },
      {
        type: 'analysis',
        title: 'AI Brand Values Synthesis',
        content: 'Our AI will synthesize the proposed brand values and provide recommendations.',
      },
    ],
  },
];