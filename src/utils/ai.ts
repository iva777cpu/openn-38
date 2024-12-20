import { pipeline } from '@huggingface/transformers';

let textGenerator: any = null;

export const initializeAI = async () => {
  if (!textGenerator) {
    console.log('Initializing AI model...');
    textGenerator = await pipeline(
      'text-generation',
      'TinyLlama/TinyLlama-1.1B-Chat-v1.0',
      { device: 'cpu' }
    );
  }
  return textGenerator;
};

export const generateIcebreaker = async (context: string) => {
  try {
    const generator = await initializeAI();
    const result = await generator(
      `Generate a fun and flirty icebreaker based on this context: ${context}`,
      {
        max_length: 100,
        temperature: 0.7,
      }
    );
    return result[0].generated_text;
  } catch (error) {
    console.error('Error generating icebreaker:', error);
    return 'Sorry, I had trouble generating an icebreaker. Please try again!';
  }
};