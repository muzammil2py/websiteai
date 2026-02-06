
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const fetchGameInfo = async (gameTitle: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a detailed history and fun facts about the classic video game: ${gameTitle}. Keep it informative and engaging.`,
      config: {
        temperature: 0.7,
        topP: 0.8,
        maxOutputTokens: 1000,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to fetch historical data. Please try again later.";
  }
};
