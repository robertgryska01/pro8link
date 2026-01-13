// File: src/ai/flows/summarize-customer-reviews.ts
'use server';
/**
 * @fileOverview An AI agent that summarizes customer reviews for a product.
 *
 * - summarizeCustomerReviews - A function that summarizes customer reviews.
 * - SummarizeCustomerReviewsInput - The input type for the summarizeCustomerReviews function.
 * - SummarizeCustomerReviewsOutput - The return type for the summarizeCustomerReviews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCustomerReviewsInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  customerReviews: z.string().describe('The customer reviews for the product.'),
});
export type SummarizeCustomerReviewsInput = z.infer<typeof SummarizeCustomerReviewsInputSchema>;

const SummarizeCustomerReviewsOutputSchema = z.object({
  summary: z.string().describe('A summary of the customer reviews.'),
});
export type SummarizeCustomerReviewsOutput = z.infer<typeof SummarizeCustomerReviewsOutputSchema>;

export async function summarizeCustomerReviews(input: SummarizeCustomerReviewsInput): Promise<SummarizeCustomerReviewsOutput> {
  return summarizeCustomerReviewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCustomerReviewsPrompt',
  input: {schema: SummarizeCustomerReviewsInputSchema},
  output: {schema: SummarizeCustomerReviewsOutputSchema},
  prompt: `You are an AI assistant that summarizes customer reviews for a product.

  Product Name: {{{productName}}}

  Customer Reviews: {{{customerReviews}}}

  Summary:`, // Keep it simple to avoid hallucination.
});

const summarizeCustomerReviewsFlow = ai.defineFlow(
  {
    name: 'summarizeCustomerReviewsFlow',
    inputSchema: SummarizeCustomerReviewsInputSchema,
    outputSchema: SummarizeCustomerReviewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
