import Constants from 'expo-constants';

// API keys from environment variables
const GEMINI_API_KEY = Constants.expoConfig?.extra?.geminiApiKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const REMOVE_BG_API_KEY = Constants.expoConfig?.extra?.removeBgApiKey || process.env.EXPO_PUBLIC_REMOVE_BG_API_KEY;

interface IdentificationResult {
  name: string;
  description: string;
  funFacts: string;
}

/**
 * Identify an object using Gemini API
 * @param imageBase64 - Base64 encoded image
 * @returns Identification result with name, description, and fun facts
 */
export async function identifyObject(imageBase64: string): Promise<IdentificationResult> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  try {
    // Call Gemini API with image
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze this image and identify the object/specimen. Return a JSON response with exactly these fields:
{
  "name": "specific name of the object (e.g., 'Monarch Butterfly (Danaus plexippus)' not just 'butterfly')",
  "description": "2-3 sentence description of what this is, including identifying features",
  "funFacts": "One interesting fact about this object/species"
}

Be specific with names. For animals and plants, include the scientific name in parentheses. For antiques or objects, include the style or era if identifiable.`
                },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: imageBase64
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 500,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to identify object');
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No response from Gemini');
    }

    // Parse JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini');
    }

    const result = JSON.parse(jsonMatch[0]);

    return {
      name: result.name || 'Unknown Object',
      description: result.description || 'An interesting find worth cataloging.',
      funFacts: result.funFacts || 'Every object has a story worth preserving.'
    };
  } catch (error: any) {
    console.error('Error identifying object:', error);
    throw error;
  }
}

/**
 * Remove background from an image using Remove.bg API
 * @param imageBase64 - Base64 encoded image
 * @returns Base64 encoded image with background removed
 */
export async function removeBackground(imageBase64: string): Promise<string> {
  if (!REMOVE_BG_API_KEY) {
    throw new Error('Remove.bg API key not configured');
  }

  try {
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVE_BG_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_file_b64: imageBase64,
        size: 'auto',
        format: 'png',
        response_type: 'base64',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.title || 'Failed to remove background');
    }

    const data = await response.json();
    return data.data.result_b64;
  } catch (error: any) {
    console.error('Error removing background:', error);
    throw error;
  }
}
