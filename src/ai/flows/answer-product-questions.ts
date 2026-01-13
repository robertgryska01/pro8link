// File: src/ai/flows/answer-product-questions.ts
'use server';

/**
 * @fileOverview An AI agent for answering frequently asked questions about products.
 *
 * - answerProductQuestions - A function that answers product-related questions.
 * - AnswerProductQuestionsInput - The input type for the answerProductQuestions function.
 * - AnswerProductQuestionsOutput - The return type for the answerProductQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerProductQuestionsInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  question: z.string().describe('The question about the product.'),
  productDetails: z.string().optional().describe('Additional details about the product for context.'),
});
export type AnswerProductQuestionsInput = z.infer<typeof AnswerProductQuestionsInputSchema>;

const AnswerProductQuestionsOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the product.'),
});
export type AnswerProductQuestionsOutput = z.infer<typeof AnswerProductQuestionsOutputSchema>;

export async function answerProductQuestions(input: AnswerProductQuestionsInput): Promise<AnswerProductQuestionsOutput> {
  return answerProductQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerProductQuestionsPrompt',
  input: {schema: AnswerProductQuestionsInputSchema},
  output: {schema: AnswerProductQuestionsOutputSchema},
  prompt: `You are a helpful AI assistant providing information about products.

  You are given the name of a product, a question about the product, and optionally some details about the product.
  Use this information to answer the question as accurately and helpfully as possible.

  Product Name: {{{productName}}}
  Question: {{{question}}}
  Product Details: {{{productDetails}}}
  `,
});

const answerProductQuestionsFlow = ai.defineFlow(
  {
    name: 'answerProductQuestionsFlow',
    inputSchema: AnswerProductQuestionsInputSchema,
    outputSchema: AnswerProductQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
