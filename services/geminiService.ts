
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async getPitchFeedback(slideTitle: string, userTranscript: string) {
    try {
      // Create a fresh instance to ensure the latest API key is used
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a world-class startup pitch coach. A first-time founder just practiced their pitch for a slide titled "${slideTitle}". 
        Here is the script they used: "${userTranscript}".
        Provide 3 extremely concise, encouraging, and tactical tips to improve their delivery, energy, or emotional hook. 
        Focus on Bangalore startup event context. Max 30 words per tip.`,
        config: {
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Keep your energy high! Focus on the emotional connection. You've got this!";
    }
  }

  async refineScript(originalScript: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Refine this pitch script to be more punchy, investor-ready, and impactful: "${originalScript}". Keep it under 40 words.`,
        config: {
          thinkingConfig: { thinkingBudget: 0 }
        }
      });
      return response.text;
    } catch (error) {
      return originalScript;
    }
  }
}

export const gemini = new GeminiService();
