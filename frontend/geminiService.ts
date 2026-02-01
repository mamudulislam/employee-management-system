
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getHRInsights = async (stats: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert HR Data Scientist. Analyze the following enterprise HR metrics and provide 3 actionable insights in short bullet points.
      Metrics: ${JSON.stringify(stats)}`,
      config: {
        systemInstruction: "Format the output as clear, concise HTML bullets. Use professional tone.",
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Insight Error:", error);
    return "Unable to load insights at this time. Please check your connectivity.";
  }
};
