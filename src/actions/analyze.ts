'use server';

import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { createStreamableValue } from 'ai/rsc';
import { StickerType } from '@/components/Sticker';

export async function extractInsights(stickers: StickerType[], stepTitle: string) {
  const stream = createStreamableValue('');

  (async () => {
    try {
      let stickerData = 'No stickers available.';
      if (stickers && stickers.length > 0) {
        stickerData = stickers.map(s => `${s.text} (Votes: ${s.votes})`).join(' \n \n');
      }

      const prompt = `Analyze the following workshop data for the step:\n\n${stickerData}`;

      const { textStream } = await streamText({
        model: anthropic('claude-3-haiku-20240307'),
        prompt,
        system: "Your goal is to reply with a summary of the design thinking workshop stickers. These stickers represent the customer personas for the project. Only reply with the summary and nothing else.",
      });

      for await (const delta of textStream) {
        stream.update(delta);
      }
    } catch (error) {
      console.error('Error in extractInsights:', error);
      stream.update('An error occurred while analyzing the data.');
    } finally {
      stream.done();
    }
  })();

  return { output: stream.value };
}