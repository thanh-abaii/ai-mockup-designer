
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Analyzes an image and returns a concise text description.
 */
export async function describeImage(base64Image: string, mimeType: string): Promise<string> {
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
                        text: "Describe this image for an AI image generator. Be concise and focus on the main subject, style, and key colors. For example: 'A minimalist geometric logo with blue and orange triangles.'",
                    },
                ],
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for image description:", error);
        throw new Error("Failed to analyze the image with the AI service.");
    }
}

/**
 * Generates a creative, detailed prompt for the final mockup generation.
 */
export async function generateCreativePrompt(imageDescription: string, scenePrompt: string, slogan: string): Promise<string> {
    const sloganInstruction = slogan ? `Please also tastefully and realistically incorporate the text "${slogan}" into the scene's advertisement.` : '';

    const systemInstruction = `You are a creative director for an advertising agency. Your task is to write a single, detailed, and photorealistic prompt for an AI image generator that will be used to fill the transparent background around a central graphic.`;

    const userContent = `
        Here are the elements to combine:
        1.  **Central Graphic Description:** ${imageDescription}
        2.  **Desired Scene:** ${scenePrompt}
        
        Your prompt must start with this exact instruction: "Take the provided image, which features a central graphic on a transparent background. Your task is to transform the transparent background into a photorealistic scene of:"
        
        Continue the instruction by creatively merging the desired scene description. The central graphic must be seamlessly and realistically integrated into this new scene (e.g., as a poster, on a screen, etc.). The final result should be a single, cohesive, and high-quality image.
        
        ${sloganInstruction}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userContent,
            config: {
                systemInstruction: systemInstruction,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for creative prompt generation:", error);
        throw new Error("Failed to brainstorm a creative concept with the AI service.");
    }
}


/**
 * Generates the final mockup image based on a pre-padded image and a detailed prompt.
 * The AI's task is to fill the background of the provided image.
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
