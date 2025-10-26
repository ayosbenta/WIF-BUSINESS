
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generatePlanDescription = async (planName: string, speed: number, price: number): Promise<string> => {
  if (!API_KEY) {
    return "AI description generation is currently unavailable.";
  }

  const prompt = `Generate a short, catchy, and appealing marketing description for a WiFi plan with the following details:
- Plan Name: "${planName}"
- Speed: ${speed} Mbps
- Price: ₱${price}/month

The description should be no more than 2 sentences and highlight the benefits for the user (e.g., streaming, gaming, work from home). Do not include the price or speed in the description itself.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating description with Gemini:", error);
    return "Failed to generate AI description. Please try again later.";
  }
};
