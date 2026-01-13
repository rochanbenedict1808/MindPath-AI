
import { GoogleGenAI, Type } from "@google/genai";
import { AssessmentResult } from "../types";

// Always initialize GoogleGenAI with a named parameter using process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeBehavioralData = async (text: string): Promise<AssessmentResult> => {
  // Use gemini-3-pro-preview for complex reasoning tasks like behavioral and psychological pattern analysis
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze the following text (simulated social media posts/blogs) to provide behavioral well-being insights and career guidance. 
    IMPORTANT: 
    1. Do NOT diagnose medical or psychological illnesses.
    2. Use non-medical terms like 'stress index', 'engagement', 'emotional trend'.
    3. Be objective and provide a career roadmap.
    
    Text: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          stressIndex: { type: Type.NUMBER, description: "Stress level from 0 to 100" },
          engagementScore: { type: Type.NUMBER, description: "Level of active engagement in interests from 0 to 100" },
          emotionalResilience: { type: Type.NUMBER, description: "Ability to handle setbacks from 0 to 100" },
          emotions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                value: { type: Type.NUMBER }
              },
              required: ["name", "value"]
            }
          },
          trends: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                segment: { type: Type.NUMBER },
                sentiment: { type: Type.NUMBER },
                intensity: { type: Type.NUMBER }
              },
              required: ["segment", "sentiment", "intensity"]
            }
          },
          interestClusters: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          careerGuidance: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                domain: { type: Type.STRING },
                reason: { type: Type.STRING },
                matchScore: { type: Type.NUMBER },
                keySkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                roadmap: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["domain", "reason", "matchScore", "keySkills", "roadmap"]
            }
          },
          explainability: {
            type: Type.OBJECT,
            properties: {
              featureImportance: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    feature: { type: Type.STRING },
                    weight: { type: Type.NUMBER }
                  }
                }
              },
              summary: { type: Type.STRING }
            }
          }
        },
        required: ["stressIndex", "engagementScore", "emotionalResilience", "emotions", "trends", "interestClusters", "careerGuidance", "explainability"]
      }
    }
  });

  try {
    // Access the .text property directly to retrieve the generated content
    const resultText = response.text || "{}";
    return JSON.parse(resultText);
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Invalid assessment response structure.");
  }
};