
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Generates a creative and detailed prompt for the mockup generation.
 */
export async function generateCreativePrompt(base64Image: string, mimeType: string, sceneContext: string, slogan: string): Promise<string> {
    const systemInstruction = `You are a world-class creative director. Your task is to write a single, concise, and highly descriptive prompt for an AI image generation model. This prompt will be used to generate a realistic mockup of a user's provided image placed within a specific scene.

Instructions:
1.  **Analyze the User's Image:** I have provided it as input. Consider its style, colors, mood, and subject matter.
2.  **Synthesize and Create:** Combine your analysis of the user's image with the provided scene context and optional slogan to create a single, powerful prompt. The prompt should instruct the image generator to seamlessly and realistically integrate the user's image (and slogan, if provided) into the scene. Describe the lighting, atmosphere, and textures to ensure a photorealistic result. Make it sound amazing and compelling.
3.  **Output ONLY the prompt text.** Do not add any extra explanations, greetings, or quotation marks around the final prompt.`;

    const userContent = `
Scene Context: "${sceneContext}"
Slogan: "${slogan || 'None'}"

Generate the prompt now based on the provided image and the details above.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: userContent,
                    },
                ],
            },
            config: {
                 systemInstruction: systemInstruction,
            }
        });

        const creativePrompt = response.text.trim();
        if (!creativePrompt) {
            throw new Error("AI creative director failed to generate a prompt.");
        }
        return creativePrompt;
    } catch (error) {
        console.error("Error calling Gemini API for creative prompt:", error);
        throw new Error("Failed to generate creative prompt from the AI service.");
    }
}


/**
 * Generates the final mockup image based on an image and a detailed prompt.
 */
export async function generateMockup(base64Image: string, mimeType: string, prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        if (response?.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return part.inlineData.data;
                }
            }
        }
        
        throw new Error("No image was generated. The AI may not have been able to complete the request.");

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error && error.message.includes('API key not valid')) {
             throw new Error("The provided API key is not valid. Please check your configuration.");
        }
        throw new Error("Failed to generate mockup image from the AI service.");
    }
}
