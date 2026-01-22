import { GoogleGenAI, Type } from "@google/genai";
import { BirthdayInsights } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBirthdayInsights = async (dateString: string): Promise<BirthdayInsights> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate fun facts and insights for a person born on ${dateString}.`,
      config: {
        systemInstruction: "You are a helpful assistant providing fun trivia based on birthdates. Keep facts concise and engaging.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            zodiac: { type: Type.STRING, description: "The zodiac sign of the person." },
            zodiacTrait: { type: Type.STRING, description: "One positive, interesting personality trait associated with this zodiac sign." },
            historicalFacts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 short, interesting historical events or pop culture moments that happened in the same birth year or on the same day in history."
            }
          },
          required: ["zodiac", "zodiacTrait", "historicalFacts"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }
    
    return JSON.parse(text) as BirthdayInsights;
  } catch (error) {
    console.error("Error fetching birthday insights:", error);
    // Return fallback data in case of error
    return {
      zodiac: "Unknown",
      zodiacTrait: "Mysterious",
      historicalFacts: ["Could not retrieve historical data at this time."]
    };
  }
};