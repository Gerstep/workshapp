'use server';

import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { createStreamableValue } from 'ai/rsc';
import { z } from 'zod';
import { streamObject } from 'ai';


export async function generate(input: string) {
  const stream = createStreamableValue('');

  (async () => {
    const { textStream } = await streamText({
      model: anthropic('claude-3-haiku-20240307'),
      prompt: input,
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream.value };
}

export async function generateHMW(input: string) {
  const stream = createStreamableValue('');

  (async () => {
    const { textStream } = await streamObject({
      model: anthropic('claude-3-haiku-20240307'),
      prompt: `Problem statement: ${input}`,
      system: `You are a helpful assistant that generates at least 3-4 HMWs for a given problem statement.`,
      schema: z.object({
        hmws: z.array(
          z.object({
            hmw: z.string(),
            confidence: z.string().describe('The confidence of how this HMW is useful in a scale from 1 to 10.'),
          }),
        ),
      }),
    });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  return { output: stream.value };
}