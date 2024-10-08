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
    title: 'Branding and Positioning Workshop',
    pages: [
      {
        type: 'instructions',
        title: 'Customer Persona',
        content: 'In this step, we will create a customer persona for our project. Your goal is to write a short description of the customer you are targeting. You can add as many stickers as you want, but it should be concise and to the point. For example: "Crypto Enthusiasts", "Young Professionals", "Parents", "Tech Savvy", "Environmental Activists", etc. Once you are ready to move to the next step, click on the "Next" button.',
      },
      {
        type: 'workshop',
        title: 'Idea Generation',
        content: 'Add your ideas as stickers. You can get inspiration from stickers added by other participants. Once you\'re done, you can start voting on the best ideas. You can vote for multiple ideas, but you only have three votes. The voting will be open for 30 minutes. After that, the voting will close and the AI will analyze the ideas and provide insights.',
      },
      {
        type: 'analysis',
        title: 'AI Analysis of Ideas',
        content: 'Now, AI will analyze the generated ideas and provide insights.',
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