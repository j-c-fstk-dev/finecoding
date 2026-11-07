import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// `gemini-flash-latest` always points to Google's current Flash model, so the
// app doesn't break when a specific model version is retired.
// The API key is read from GEMINI_API_KEY or GOOGLE_API_KEY.
export const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-flash-latest'),
});
