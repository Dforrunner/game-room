import OpenAI from 'openai';

class OpenAIClient {
  private static instance: OpenAI | null = null;

  // Private constructor to prevent direct instantiation
  private constructor() {}

  // Public method to get the single instance of OpenAIApi
  public static getInstance(): OpenAI {
    if (!OpenAIClient.instance) {
      // Create and store the instance
      OpenAIClient.instance = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        organization: process.env.OPENAI_ORG_ID,
        project: process.env.OPENAI_PROJECT_ID,
      });
    }

    return OpenAIClient.instance;
  }
}

// Export the OpenAIClient class
export default OpenAIClient;
