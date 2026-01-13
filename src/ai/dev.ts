// File: src/ai/dev.ts
import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-customer-reviews.ts';
import '@/ai/flows/generate-product-description.ts';
import '@/ai/flows/answer-product-questions.ts';
